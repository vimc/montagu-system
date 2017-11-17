package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.GroupBurdenEstimatesController
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.*
import java.time.Instant

class UploadBurdenEstimateTests : ControllerTests<GroupBurdenEstimatesController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = GroupBurdenEstimatesController(controllerContext)

    @Test
    fun `can get metadata for burden estimates`()
    {
        val data = listOf(
                BurdenEstimateSet(1, Instant.MIN, "ThePast",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CentralAveraged, "Median"),
                        emptyList()
                ),
                BurdenEstimateSet(2, Instant.MAX, "TheFuture",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CentralSingleRun, null),
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
        val controller = makeController(mockControllerContext())
        assertThat(controller.getBurdenEstimates(context, repo))
                .hasSameElementsAs(data.toList())
        verify(repo).getBurdenEstimateSets("group-1", "touchstone-1", "scenario-1")
    }

    @Test
    fun `estimates are passed through to repository`()
    {
        val data = listOf(
                BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimate("yf", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )
        val touchstoneSet = mockTouchstones()
        val repo = mockRepository(touchstoneSet)

        val before = Instant.now()
        val controller = GroupBurdenEstimatesController(mockControllerContext())
        controller.addBurdenEstimates(mockActionContext(data), repo)
        val after = Instant.now()
        verify(touchstoneSet).get("touchstone-1")
        verify(repo).addBurdenEstimateSet(
                eq("group-1"), eq("touchstone-1"), eq("scenario-1"),
                eq(data), eq("username"), timestamp = check { it > before && it < after })
    }

    @Test
    fun `cannot upload data with multiple diseases`()
    {
        val data = listOf(
                BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000.toDecimal(), mapOf(
                        "deaths" to 10.toDecimal(),
                        "cases" to 100.toDecimal()
                )),
                BurdenEstimate("menA", 1980, 30, "AGO", "Angola", 2000.toDecimal(), mapOf(
                        "deaths" to 20.toDecimal(),
                        "dalys" to 73.6.toDecimal()
                ))
        )
        val controller = GroupBurdenEstimatesController(mockControllerContext())
        assertThatThrownBy { controller.addBurdenEstimates(mockActionContext(data), mockRepository()) }
                .isInstanceOf(InconsistentDataError::class.java)
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

    private fun mockActionContext(data: List<BurdenEstimate>): ActionContext
    {
        return mock {
            on { csvData(eq(BurdenEstimate::class), any()) } doReturn data
            on { username } doReturn "username"
            on { params(":group-id") } doReturn "group-1"
            on { params(":touchstone-id") } doReturn "touchstone-1"
            on { params(":scenario-id") } doReturn "scenario-1"
        }
    }

    private fun mockTouchstones() = mock<SimpleDataSet<Touchstone, String>> {
        on { get("touchstone-1") } doReturn Touchstone("touchstone-1", "touchstone", 1, "Description", TouchstoneStatus.OPEN)
    }

    private fun mockTouchstoneRepository(touchstoneSet: SimpleDataSet<Touchstone, String> = mockTouchstones()) =
            mock<TouchstoneRepository> {
                on { touchstones } doReturn touchstoneSet
            }

    private fun mockRepository(touchstoneSet: SimpleDataSet<Touchstone, String> = mockTouchstones()): BurdenEstimateRepository
    {
        val touchstoneRepo = mockTouchstoneRepository(touchstoneSet)
        return mock {
            on { touchstoneRepository } doReturn touchstoneRepo
        }
    }
}