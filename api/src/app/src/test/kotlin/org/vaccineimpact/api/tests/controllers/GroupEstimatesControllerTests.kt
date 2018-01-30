package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.controllers.GroupBurdenEstimatesController
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class GroupEstimatesControllerTests : MontaguTests()
{
    @Test
    fun `can get metadata for burden estimates`()
    {
        val data = listOf(
                BurdenEstimateSet(1, Instant.MIN, "ThePast",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "Median"),
                        BurdenEstimateSetStatus.COMPLETE,
                        emptyList()
                ),
                BurdenEstimateSet(2, Instant.MAX, "TheFuture",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, null),
                        BurdenEstimateSetStatus.EMPTY,
                        listOf("Doesn't exist yet")
                )
        )
        val touchstoneRepo = mockTouchstoneRepository()
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSets(any(), any(), any()) } doReturn data
            on { touchstoneRepository } doReturn touchstoneRepo
        }
        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
        }
        assertThat(GroupBurdenEstimatesController(context, repo).getBurdenEstimates())
                .hasSameElementsAs(data.toList())
        verify(repo).getBurdenEstimateSets("group-1", "touchstone-1", "scenario-1")
    }

    @Test
    fun `estimate set is created`()
    {
        val touchstoneSet = mockTouchstones()
        val repo = mockRepository(touchstoneSet)

        val before = Instant.now()
        val properties = CreateBurdenEstimateSet(
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
                1
        )
        val mockContext = mock<ActionContext> {
            on { username } doReturn "username"
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
            on { postData<CreateBurdenEstimateSet>() } doReturn properties
        }
        val url = GroupBurdenEstimatesController(mockContext, repo).createBurdenEstimateSet()
        val after = Instant.now()
        assertThat(url).endsWith("/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimates/1/")
        verify(touchstoneSet).get("touchstone-1")
        verify(repo).createBurdenEstimateSet(
                eq("group-1"), eq("touchstone-1"), eq("scenario-1"),
                eq(properties),
                eq("username"),
                timestamp = check { it > before && it < after })
    }

    @Test
    fun `can populate central estimate set`()
    {
        val touchstoneSet = mockTouchstones()
        val repo = mockRepository(touchstoneSet,
                existingBurdenEstimateSet = defaultEstimateSet.withType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN))

        val expectedData = listOf(
                BurdenEstimateWithRunId("yf", null, 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimateWithRunId("yf", null, 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )

        val mockContext = mockActionContextWithCSVData(normalCSVData)
        verifyRepositoryIsInvokedToPopulateSet(mockContext, repo, touchstoneSet, expectedData)
    }

    @Test
    fun `can populate stochastic estimate set`()
    {
        val touchstoneSet = mockTouchstones()
        val repo = mockRepository(touchstoneSet,
                existingBurdenEstimateSet = defaultEstimateSet.withType(BurdenEstimateSetTypeCode.STOCHASTIC))

        val csvData = listOf(
                StochasticBurdenEstimate("yf", "runA", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                StochasticBurdenEstimate("yf", "runB", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )
        val expectedData = listOf(
                BurdenEstimateWithRunId("yf", "runA", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimateWithRunId("yf", "runB", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )

        val mockContext = mockActionContextWithCSVData(csvData.asSequence())
        verifyRepositoryIsInvokedToPopulateSet(mockContext, repo, touchstoneSet, expectedData)
    }

    @Test
    fun `if keepOpen is not provided, populate closes estimate set`()
    {
        // This way, the webapps will carry on with the same behaviour as before.
        // It's only if a client explicitly sets keepOpen that we will see the partial state
        populateAndCheckIfSetIsClosed(keepOpen = null, expectedClosed = true)
    }

    @Test
    fun `if keepOpen is true, burden estimate set is left open`()
    {
        populateAndCheckIfSetIsClosed(keepOpen = "true", expectedClosed = false)
    }

    @Test
    fun `if keepOpen is false, populate closes burden estimate set`()
    {
        populateAndCheckIfSetIsClosed(keepOpen = "false", expectedClosed = true)
    }

    private fun populateAndCheckIfSetIsClosed(keepOpen: String?, expectedClosed: Boolean)
    {
        val timesExpected = if (expectedClosed) times(1) else never()

        val repo = mockRepository()
        val mockContext = mockActionContextWithCSVData(normalCSVData, keepOpen = keepOpen)
        GroupBurdenEstimatesController(mockContext, repo).populateBurdenEstimateSet()
        verify(repo, timesExpected).closeBurdenEstimateSet(defaultEstimateSet.id)
    }

    @Test
    fun `cannot upload data with multiple diseases`()
    {
        val data = sequenceOf(
                BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimate("menA", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )
        val actionContext = mockActionContextWithCSVData(data)
        assertThatThrownBy {
            GroupBurdenEstimatesController(actionContext, mockRepository()).populateBurdenEstimateSet()
        }.isInstanceOf(InconsistentDataError::class.java)
    }

    @Test
    fun `burden estimate data is parsed if it is correctly formatted`()
    {
        val csv = """
            disease,year,age,country,country_name,cohort_size,deaths,cases
                 yf,2000, 50,    AFG, Afghanistan,       1000,    50,  100
                 yf,2001, 50,    AFG, Afghanistan,       1000,  63.5,  120
        """
        val data = DataTableDeserializer.deserialize(csv, BurdenEstimate::class).toList()
        assertThat(data).containsExactlyElementsOf(listOf(
                BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 50.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimate("yf", 2001, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 63.5.toDecimal(),
                        "cases" to 120.toDecimal()
                ))
        ))
    }

    private fun <T : Any> mockActionContextWithCSVData(csvData: List<T>, keepOpen: String? = null) = mockActionContextWithCSVData(csvData.asSequence(), keepOpen = keepOpen)

    private fun <T : Any> mockActionContextWithCSVData(csvData: Sequence<T>, keepOpen: String? = null): ActionContext
    {
        return mock {
            on { csvData<T>(any(), any<RequestBodySource>()) } doReturn csvData
            on { csvData<T>(any(), any<String>()) } doReturn csvData
            on { username } doReturn "username"
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
            on { queryParams("keepOpen") } doReturn keepOpen
        }
    }

    private fun verifyRepositoryIsInvokedToPopulateSet(
            actionContext: ActionContext, repo: BurdenEstimateRepository,
            touchstoneSet: SimpleDataSet<Touchstone, String>, expectedData: List<BurdenEstimateWithRunId>
    )
    {
        GroupBurdenEstimatesController(actionContext, repo).populateBurdenEstimateSet()
        verify(touchstoneSet).get("touchstone-1")
        verify(repo).populateBurdenEstimateSet(eq(1),
                eq("group-1"), eq("touchstone-1"), eq("scenario-1"),
                argWhere { it.toSet() == expectedData.toSet() }
        )
    }

    private fun mockTouchstones() = mock<SimpleDataSet<Touchstone, String>> {
        on { get("touchstone-1") } doReturn Touchstone("touchstone-1", "touchstone", 1, "Description", TouchstoneStatus.OPEN)
        on { get("touchstone-bad") } doReturn Touchstone("touchstone-bad", "touchstone", 1, "not open", TouchstoneStatus.IN_PREPARATION)
    }

    private fun mockTouchstoneRepository(touchstoneSet: SimpleDataSet<Touchstone, String> = mockTouchstones()) =
            mock<TouchstoneRepository> {
                on { touchstones } doReturn touchstoneSet
            }

    private fun mockRepository(
            touchstoneSet: SimpleDataSet<Touchstone, String> = mockTouchstones(),
            existingBurdenEstimateSet: BurdenEstimateSet = defaultEstimateSet
    ): BurdenEstimateRepository
    {
        val touchstoneRepo = mockTouchstoneRepository(touchstoneSet)
        return mock {
            on { touchstoneRepository } doReturn touchstoneRepo
            on { getBurdenEstimateSet(any()) } doReturn existingBurdenEstimateSet
            on { createBurdenEstimateSet(any(), any(), any(), any(), any(), any()) } doReturn 1
            on { populateBurdenEstimateSet(any(), any(), any(), any(), any()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimate>>(4).toList()
                Unit
            }
        }
    }

    private val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList()
    )

    private val normalCSVData = listOf(
            BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                    "deaths" to 10.toDecimal(),
                    "cases" to 100.toDecimal()
            )),
            BurdenEstimate("yf", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                    "deaths" to 20.toDecimal(),
                    "dalys" to 73.6.toDecimal()
            ))
    )
}