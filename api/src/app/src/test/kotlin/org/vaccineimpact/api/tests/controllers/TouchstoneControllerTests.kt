package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import java.math.BigDecimal

class TouchstoneControllerTests : ControllerTests<TouchstoneController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = TouchstoneController(controllerContext)

    private val openTouchstone = Touchstone("t-1", "t", 1, "description", TouchstoneStatus.OPEN)
    private val inPrepTouchstone =  Touchstone("t-2", "t", 2, "description", TouchstoneStatus.IN_PREPARATION)
    private val source = "test-source"
    private val type = "test-type"
    private val scenario = Scenario("id", "desc", "disease", listOf("t1, t2"))

    @Test
    fun `getTouchstones returns touchstones`()
    {
        val touchstones = listOf(
                openTouchstone
        )
        val repo = mock<TouchstoneRepository> {
            on { this.touchstones } doReturn InMemoryDataSet(touchstones)
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }

        val controller = TouchstoneController(mockControllerContext())
        assertThat(controller.getTouchstones(context, repo)).hasSameElementsAs(touchstones)
    }

    @Test
    fun `getTouchstones filters out in-preparation touchstones if the user doesn't have the permissions`()
    {
        val touchstones = listOf(
                openTouchstone, inPrepTouchstone
        )
        val repo = mock<TouchstoneRepository> {
            on { this.touchstones } doReturn InMemoryDataSet(touchstones)
        }
        val controller = TouchstoneController(mockControllerContext())

        val permissiveContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }

        assertThat(controller.getTouchstones(permissiveContext, repo)).hasSize(2)

        val limitedContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn false
        }

        assertThat(controller.getTouchstones(limitedContext, repo)).hasSize(1)
    }

    @Test
    fun `getScenario fetches from repository`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))
        val result = ScenarioAndCoverageSets(scenario, coverageSets)

        val repo = mock<TouchstoneRepository> {
            on { getScenario(any(), any()) } doReturn result
            on { touchstones } doReturn InMemoryDataSet(listOf(openTouchstone))
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn openTouchstone.id
            on { params(":scenario-id") } doReturn scenario.id
        }

        val controller = TouchstoneController(mockControllerContext())
        val data = controller.getScenario(context, repo)

        verify(repo).getScenario(eq(openTouchstone.id), eq(scenario.id))
        assertThat(data.touchstone).isEqualTo(openTouchstone)
        assertThat(data.scenario).isEqualTo(scenario)
        assertThat(data.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenario requires touchstones prepare permission for in-preparation touchstone`()
    {
        val repo = mock<TouchstoneRepository> {
            on { touchstones } doReturn InMemoryDataSet(listOf(inPrepTouchstone))
            on { getScenario(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, emptyList())
        }
        val context = mock<ActionContext> {
            on { params(":touchstone-id") } doReturn inPrepTouchstone.id
            on { params(":scenario-id") } doReturn scenario.id
        }
        val controller = TouchstoneController(mockControllerContext())
        controller.getScenario(context, repo)
        verify(context).requirePermission(ReifiedPermission("touchstones.prepare", Scope.Global()))
    }


    @Test
    fun `getDemographicData fetches from repository`()
    {
        val demographicMetadata = DemographicDataForTouchstone(openTouchstone,
                DemographicMetadata("id", "name", null, listOf(), "people", "age", source))

        val repo = mock<TouchstoneRepository> {
            on { getDemographicData(type, source, openTouchstone.id) } doReturn
                    SplitData(demographicMetadata, DataTable.new(emptySequence()))
            on { touchstones } doReturn InMemoryDataSet(listOf(openTouchstone))
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn openTouchstone.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
        }

        val controller = TouchstoneController(mockControllerContext())
        val data = controller.getDemographicDataAndMetadata(context, repo)

        assertThat(data.structuredMetadata).isEqualTo(demographicMetadata)

    }

    @Test
    fun `gets wide demographic data`()
    {
        val repo = getRepoWithDemographicData()

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn openTouchstone.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "wide"
        }

        val controller = TouchstoneController(mockControllerContext())
        val data = controller.getDemographicDataAndMetadata(context, repo)
                .data.toList()

        val first = data[0] as WideDemographicRow
        val second = data[1] as WideDemographicRow
        val third = data[1] as WideDemographicRow

        assertThat(data.count() == 3)
        assertThat(first.valuesPerYear.keys.count() == 3
                && first.valuesPerYear.containsKey(1980) && first.valuesPerYear.containsKey(1985)
                && first.valuesPerYear.containsKey(1980))

        assertThat(second.valuesPerYear.keys.count() == 1)
        assertThat(third.valuesPerYear.keys.count() == 2)

    }

    @Test
    fun `gets long demographic data if format=long`()
    {
        val repo = getRepoWithDemographicData()

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn openTouchstone.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "long"
        }

        val controller = TouchstoneController(mockControllerContext())
        val data = controller.getDemographicDataAndMetadata(context, repo).data

        Assertions.assertThat(data.first() is LongDemographicRow).isTrue()
    }

    @Test
    fun `throws error if supplied format is invalid`()
    {
        val repo = getRepoWithDemographicData()

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-id") } doReturn openTouchstone.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "678hj"
        }

        val controller = TouchstoneController(mockControllerContext())

        Assertions.assertThatThrownBy { controller.getDemographicDataAndMetadata(context, repo) }
                .isInstanceOf(BadRequest::class.java)
    }

    private fun getRepoWithDemographicData(): TouchstoneRepository
    {
        val demographicMetadata = DemographicDataForTouchstone(openTouchstone,
                DemographicMetadata("id", "name", null, listOf(), "people", "age", source))

        val fakeRows = sequenceOf(
                LongDemographicRow(123, "ABC", "ABC-country", 0, 5, 1980, "F", BigDecimal(1200)),
                LongDemographicRow(123, "ABC", "ABC-country", 0, 5, 1985, "F", BigDecimal(1300)),
                LongDemographicRow(123, "ABC", "ABC-country", 0, 5, 1990, "F", BigDecimal(1400)),
                LongDemographicRow(123, "ABC", "ABC-country", 5, 10, 1980, "F", BigDecimal(1500)),
                LongDemographicRow(456, "DEF", "DEF-country", 0, 5, 1980, "F", BigDecimal(2200)),
                LongDemographicRow(456, "DEF", "DEF-country", 0, 5, 1985, "F", BigDecimal(2300))
        )

        return mock<TouchstoneRepository> {
            on { getDemographicData(type, source, openTouchstone.id) } doReturn
                    SplitData(demographicMetadata, DataTable.new(fakeRows))
            on { touchstones } doReturn InMemoryDataSet(listOf(openTouchstone))
        }
    }
}
