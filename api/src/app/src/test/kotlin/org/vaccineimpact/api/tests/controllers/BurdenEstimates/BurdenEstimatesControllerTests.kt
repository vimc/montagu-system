package org.vaccineimpact.api.tests.controllers.BurdenEstimates

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.mockito.Mockito
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.controllers.BurdenEstimates.BurdenEstimatesController
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.DataTableDeserializer
import java.time.Instant

class BurdenEstimatesControllerTests : BurdenEstimateControllerTestsBase()
{
    @Test
    fun `can get metadata for burden estimates`()
    {
        val data = listOf(
                BurdenEstimateSet(1, Instant.MIN, "ThePast",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "Median"),
                        BurdenEstimateSetStatus.COMPLETE,
                        emptyList(),
                        "file.csv"
                ),
                BurdenEstimateSet(2, Instant.MAX, "TheFuture",
                        BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, null),
                        BurdenEstimateSetStatus.EMPTY,
                        listOf("Doesn't exist yet"),
                        null
                )
        )
        val touchstoneRepo = mockTouchstoneRepository()
        val repo = mock<BurdenEstimateRepository> {
            on { touchstoneRepository } doReturn touchstoneRepo
        }
        val logic = mock<BurdenEstimateLogic> {
            on { getBurdenEstimateSets(any(), any(), any()) } doReturn data
        }
        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
        }
        assertThat(BurdenEstimatesController(context, logic, repo).getBurdenEstimateSets())
                .hasSameElementsAs(data.toList())
        verifyValidResponsibilityPathChecks(logic, context)
    }


    @Test
    fun `can get metadata for single burden estimate set`()
    {
        val data = BurdenEstimateSet(1, Instant.MIN, "ThePast",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "Median"),
                BurdenEstimateSetStatus.COMPLETE,
                emptyList(),
                "file.csv"
        )
        val touchstoneRepo = mockTouchstoneRepository()
        val repo = mock<BurdenEstimateRepository> {
            on { touchstoneRepository } doReturn touchstoneRepo
        }
        val logic = mock<BurdenEstimateLogic> {
            on { getBurdenEstimateSet(groupId, touchstoneVersionId, "scenario-1", 1) } doReturn data
        }
        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
            on { params(":set-id") } doReturn "1"
        }
        assertThat(BurdenEstimatesController(context, logic, repo).getBurdenEstimateSet())
                .isEqualTo(data)
        verifyValidResponsibilityPathChecks(logic, context)
    }

    @Test
    fun `estimate set is created`()
    {
        val touchstoneSet = mockTouchstones()
        val repo = mockEstimatesRepository(touchstoneSet)

        val before = Instant.now()
        val properties = CreateBurdenEstimateSet(
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
                1
        )
        val mockContext = mock<ActionContext> {
            on { username } doReturn "username"
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
            on { postData<CreateBurdenEstimateSet>() } doReturn properties
        }

        val logic = mockLogic()

        val url = BurdenEstimatesController(mockContext, logic, repo).createBurdenEstimateSet()
        val after = Instant.now()

        assertThat(url).endsWith("/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/estimate-sets/1/")
        verify(repo).checkModelRunParameterSetExists(1, groupId, touchstoneVersionId)

        verify(logic).createBurdenEstimateSet(
                eq(groupId), eq(touchstoneVersionId), eq(scenarioId),
                eq(properties),
                eq("username"),
                timestamp = check { it > before && it < after })
        verifyValidResponsibilityPathChecks(logic, mockContext)
    }

    @Test
    fun `can close burden estimate set`()
    {
        val logic = mockLogic()
        val repo = mockEstimatesRepository()
        val mockContext = mock<ActionContext> {
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
        }
        BurdenEstimatesController(mockContext, logic, repo).closeBurdenEstimateSet()
        verify(logic).closeBurdenEstimateSet(1, groupId, touchstoneVersionId, scenarioId)
        verifyValidResponsibilityPathChecks(logic, mockContext)
    }

    @Test
    fun `catches error and returns result when closing burden estimate set`()
    {
        val logic = mockLogic()
        val repo = mockEstimatesRepository()
        Mockito.`when`(logic.closeBurdenEstimateSet(any(), any(), any(), any()))
                .doThrow(MissingRowsError("message"))
        val mockContext = mock<ActionContext> {
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
        }
        val result = BurdenEstimatesController(mockContext, logic, repo)
                .closeBurdenEstimateSet()
        assertThat(result.status).isEqualTo(ResultStatus.FAILURE)
        verifyValidResponsibilityPathChecks(logic, mockContext)
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
                BurdenEstimate("yf", 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 50F,
                        "cases" to 100F
                )),
                BurdenEstimate("yf", 2001, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 63.5F,
                        "cases" to 120F
                ))
        ))
    }

    @Test
    fun `gets estimated outcome grouped by age`()
    {
        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
            on { params(":outcome-code") } doReturn "test-outcome"
            on { params(":set-id") } doReturn "1"
        }
        val logic = mock<BurdenEstimateLogic>()
        val touchstones = mockTouchstoneRepository()
        val repo = mock<BurdenEstimateRepository> {
            on { touchstoneRepository } doReturn touchstones
        }
        val sut = BurdenEstimatesController(context, logic, repo)
        sut.getEstimatesForOutcome()

        verify(logic).getEstimates(eq(1), eq(groupId), eq(touchstoneVersionId), eq(scenarioId),
                eq("test-outcome"),
                eq(BurdenEstimateGrouping.AGE))
        verifyValidResponsibilityPathChecks(logic, context)
    }

    @Test
    fun `gets estimated outcome grouped by year`()
    {
        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
            on { params(":outcome-code") } doReturn "deaths"
            on { params(":set-id") } doReturn "1"
            on { queryParams("groupBy") } doReturn "year"
        }
        val logic = mock<BurdenEstimateLogic>()
        val touchstones = mockTouchstoneRepository()
        val repo = mock<BurdenEstimateRepository> {
            on { touchstoneRepository } doReturn touchstones
        }
        val sut = BurdenEstimatesController(context, logic, repo)
        sut.getEstimatesForOutcome()

        verify(logic).getEstimates(eq(1), eq(groupId), eq(touchstoneVersionId), eq(scenarioId),
                eq("deaths"),
                eq(BurdenEstimateGrouping.YEAR))
        verifyValidResponsibilityPathChecks(logic, context)
    }

    @Test
    fun `can get burden estimate set data`()
    {
        val logic = mockLogic()
        val repo = mockEstimatesRepository()
        val mockContext = mock<ActionContext> {
            on { params(":set-id") } doReturn "1"
            on { params(":group-id") } doReturn groupId
            on { params(":touchstone-version-id") } doReturn touchstoneVersionId
            on { params(":scenario-id") } doReturn scenarioId
        }
        BurdenEstimatesController(mockContext, logic, repo).getBurdenEstimateSetData()
        verify(logic).getBurdenEstimateData(1, groupId, touchstoneVersionId, scenarioId)
        verifyValidResponsibilityPathChecks(logic, mockContext)
    }

}