package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import java.math.BigDecimal

class ModellingGroupControllersTests : ControllerTests()
{
    @Test
    fun `getResponsibilities gets parameters from URL`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.FINISHED
        )
        val controllerContext = mockRepository(mock {
            on { getResponsibilities(any(), any(), any()) } doReturn data
        })
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn true
        }

        val controller = ModellingGroupController(controllerContext)
        controller.getResponsibilities(context)

        verify(getRepository(controllerContext)).getResponsibilities(eq("gId"), eq("tId"), any())
    }

    @Test
    fun `getResponsibilities returns error if user does not have permission to see in-preparation touchstone`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.IN_PREPARATION
        )
        val controllerContext = mockRepository(mock {
            on { getResponsibilities(any(), any(), any()) } doReturn data
        })
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn false
        }

        val controller = ModellingGroupController(controllerContext)
        assertThatThrownBy {
            controller.getResponsibilities(context)
        }.hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getResponsibility gets parameters from URL`()
    {
        val controllerContext = makeRepoMockingGetResponsibility(TouchstoneStatus.OPEN)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(controllerContext)
        controller.getResponsibility(context)

        verify(getRepository(controllerContext)).getResponsibility(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getResponsibility returns error if user does not have permission to see in-preparation touchstone`()
    {
        val controllerContext = makeRepoMockingGetResponsibility(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        val controller = ModellingGroupController(controllerContext)
        assertThatThrownBy { controller.getResponsibility(context) }
                .hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getCoverageSets gets parameters from URL`()
    {
        val controllerContext = makeRepoMockingGetCoverageSets(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(controllerContext)
        controller.getCoverageSets(context)

        verify(getRepository(controllerContext)).getCoverageSets(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getCoverageSets returns error if user does not have permission to see in-preparation touchstone`()
    {
        val controllerContext = makeRepoMockingGetCoverageSets(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        val controller = ModellingGroupController(controllerContext)
        assertThatThrownBy { controller.getCoverageSets(context) }
                .hasMessageContaining("Unknown touchstone")
    }

    @Test
    fun `getCoverageData gets parameters from URL`()
    {
        val controllerContext = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(true)
        val controller = ModellingGroupController(controllerContext)
        controller.getCoverageData(context)
        verify(getRepository(controllerContext)).getCoverageData(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getCoverageData returns error if user does not have permission to see in-preparation touchstone`()
    {
        val controllerContext = makeRepoMockingGetCoverageData(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        val controller = ModellingGroupController(controllerContext)
        assertThatThrownBy { controller.getCoverageData(context) }
                .hasMessageContaining("Unknown touchstone")
    }

    private fun mockRepository(repo: ModellingGroupRepository): ControllerContext
    {
        return mockControllerContext(repo) { it.modellingGroup }
    }
    private fun getRepository(controllerContext: ControllerContext) = controllerContext.repositories.modellingGroup()

    private fun mockContextForSpecificResponsibility(hasPermissions: Boolean): ActionContext
    {
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { hasPermission(any()) } doReturn hasPermissions
        }
        return context
    }

    private fun makeRepoMockingGetResponsibility(status: TouchstoneStatus): ControllerContext
    {
        val data = ResponsibilityAndTouchstone(
                Touchstone("tId", "t", 1, "desc", YearRange(1900, 2000), status),
                Responsibility(
                        Scenario("sId", "scDesc", "disease", listOf("t-1")),
                        ResponsibilityStatus.EMPTY, emptyList(), null
                )
        )
        return mockRepository(mock {
            on { getResponsibility(any(), any(), any()) } doReturn data
        })
    }

    private fun makeRepoMockingGetCoverageSets(status: TouchstoneStatus) = mockRepository(mock {
        on { getCoverageSets(any(), any(), any()) } doReturn mockCoverageSetsData(status)
    })

    private fun makeRepoMockingGetCoverageData(status: TouchstoneStatus): ControllerContext
    {
        val coverageSets = mockCoverageSetsData(status)
        val data = SplitData(coverageSets, DataTable.new(listOf(
                CoverageRow("sId", 1, 0, "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN,
                        "ABC", 2000, BigDecimal.ZERO, BigDecimal.TEN, "0-10", null, BigDecimal("67.88"))
        )))
        return mockRepository(mock {
            on { getCoverageData(any(), any(), any()) } doReturn data
        })
    }

    private fun mockCoverageSetsData(status: TouchstoneStatus) = ScenarioTouchstoneAndCoverageSets(
            Touchstone("tId", "t", 1, "desc", YearRange(1900, 2000), status),
            Scenario("sId", "scDesc", "disease", listOf("t-1")),
            listOf(
                    CoverageSet(1, "tId", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            )
    )
}