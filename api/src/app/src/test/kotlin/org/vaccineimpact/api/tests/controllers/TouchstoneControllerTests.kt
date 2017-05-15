package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests

class TouchstoneControllerTests : MontaguTests()
{
    @Test
    fun `getTouchstones returns touchstones`()
    {
        val touchstones = listOf(
                Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.OPEN)
        )
        val repo = mock<TouchstoneRepository> {
            on { this.touchstones } doReturn InMemoryDataSet(touchstones)
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }

        val controller = TouchstoneController({ repo })
        assertThat(controller.getTouchstones(context)).hasSameElementsAs(touchstones)
    }

    @Test
    fun `getTouchstones filters out in-preparation touchstones if the user doesn't have the permissions`()
    {
        val touchstones = listOf(
                Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.OPEN),
                Touchstone("t-2", "t", 2, "description", YearRange(2000, 2010), TouchstoneStatus.IN_PREPARATION)
        )
        val repo = mock<TouchstoneRepository> {
            on { this.touchstones } doReturn InMemoryDataSet(touchstones)
        }
        val controller = TouchstoneController({ repo })

        val permissiveContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }
        assertThat(controller.getTouchstones(permissiveContext)).hasSize(2)

        val limitedContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn false
        }
        assertThat(controller.getTouchstones(limitedContext)).hasSize(1)
    }

    @Test
    fun `getScenario fetches from repository`()
    {
        val touchstone = Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.OPEN)
        val scenario = Scenario("id", "desc", "disease", listOf("t1, t2"))
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))
        val result = ScenarioAndCoverageSets(scenario, coverageSets)

        val repo = mock<TouchstoneRepository> {
            on { getScenario(any(), any()) } doReturn result
            on { touchstones } doReturn InMemoryDataSet(listOf(touchstone))
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn touchstone.id
            on { params(":scenario-id") } doReturn scenario.id
        }

        val controller = TouchstoneController({ repo })
        val data = controller.getScenario(context)

        verify(repo).getScenario(eq(touchstone.id), eq(scenario.id))
        assertThat(data.touchstone).isEqualTo(touchstone)
        assertThat(data.scenario).isEqualTo(scenario)
        assertThat(data.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenario throws exception on in-preparation touchstone if user doesn't have permission`()
    {
        val touchstone = Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.IN_PREPARATION)
        val repo = mock<TouchstoneRepository> {
            on { touchstones } doReturn InMemoryDataSet(listOf(touchstone))
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn false
            on { params(":touchstone-id") } doReturn touchstone.id
        }

        val controller = TouchstoneController({ repo })
        assertThatThrownBy { controller.getScenario(context) }.hasMessageContaining("touchstones.prepare")
    }
}
