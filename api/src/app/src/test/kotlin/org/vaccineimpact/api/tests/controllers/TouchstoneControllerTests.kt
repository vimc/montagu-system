package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.logic.CoverageLogic
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.ScenarioLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.DataTable
import org.vaccineimpact.api.serialization.SplitData
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleResponsibilitySetWithExpectations
import java.math.BigDecimal

class TouchstoneControllerTests : MontaguTests()
{
    private val openTouchstoneVersion = TouchstoneVersion("t-1", "t", 1, "description", TouchstoneStatus.OPEN)
    private val inPrepTouchstoneVersion = TouchstoneVersion("t-2", "t", 2, "description", TouchstoneStatus.IN_PREPARATION)
    private val touchstone = Touchstone(
            id = "t",
            description = "touchstone description",
            comment = "comment",
            versions = listOf(openTouchstoneVersion, inPrepTouchstoneVersion)
    )
    private val source = "test-source"
    private val type = "test-type"
    private val scenario = Scenario("id", "desc", "disease", listOf("t1, t2"))

    @Test
    fun `getTouchstones returns touchstones`()
    {
        val repo = mock<TouchstoneRepository> {
            on { this.getTouchstones() } doReturn listOf(touchstone)
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }

        val controller = TouchstoneController(context, repo, mock(), mock(), mock())
        assertThat(controller.getTouchstones()).hasSameElementsAs(listOf(touchstone))
    }

    @Test
    fun `getTouchstones filters out in-preparation touchstones if the user doesn't have the permissions`()
    {
        val repo = mock<TouchstoneRepository> {
            on { this.getTouchstones() } doReturn listOf(touchstone)
        }

        val permissiveContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }
        assertThat(TouchstoneController(permissiveContext, repo, mock(), mock(), mock())
                .getTouchstones()).isEqualTo(listOf(touchstone))

        val limitedContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn false
        }
        assertThat(TouchstoneController(limitedContext, repo, mock(), mock(), mock()).getTouchstones()).isEqualTo(listOf(Touchstone(
                id = "t",
                description = "touchstone description",
                comment = "comment",
                versions = listOf(openTouchstoneVersion)
        )))
    }

    @Test
    fun `getScenario fetches scenario without coverage sets if user has no coverage reading permission`()
    {
        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
        }

        val logic = mock<ScenarioLogic> {
            on { getScenario(any(), any()) } doReturn scenario
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":scenario-id") } doReturn scenario.id
            on { permissions } doReturn PermissionSet(listOf())
        }

        val data = TouchstoneController(context, repo, mock(), logic, mock()).getScenario()
                as ScenarioTouchstone

        assertThat(data.touchstoneVersion).isEqualTo(openTouchstoneVersion)
        assertThat(data.scenario).isEqualTo(scenario)
    }

    @Test
    fun `getScenario fetches scenario without coverage sets if user has wrongly scoped coverage reading permission`()
    {
        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
        }

        val logic = mock<ScenarioLogic> {
            on { getScenario(any(), any()) } doReturn scenario
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":scenario-id") } doReturn scenario.id
            on { permissions } doReturn PermissionSet(
                    setOf(ReifiedPermission("coverage.read", Scope.Specific("modelling-group", "wrongId"))
                    )
            )
        }

        val data = TouchstoneController(context, repo, modellingGroupRepo, logic, mock()).getScenario()
                as ScenarioTouchstone

        assertThat(data.touchstoneVersion).isEqualTo(openTouchstoneVersion)
        assertThat(data.scenario).isEqualTo(scenario)
    }

    @Test
    fun `getScenario fetches scenario with coverage sets if user has global coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":scenario-id") } doReturn scenario.id
            on { permissions } doReturn PermissionSet(
                    setOf(ReifiedPermission("coverage.read", Scope.Global())))
        }

        val data = TouchstoneController(context, repo, mock(), mock(), mock()).getScenario()
                as ScenarioTouchstoneAndCoverageSets

        assertThat(data.touchstoneVersion).isEqualTo(openTouchstoneVersion)
        assertThat(data.scenario).isEqualTo(scenario)
        assertThat(data.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenario fetches scenario with coverage sets if user has scoped coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":scenario-id") } doReturn scenario.id
            on { permissions } doReturn PermissionSet(
                    setOf(ReifiedPermission("coverage.read", Scope.Specific("modelling-group", "gId"))))
        }

        val data = TouchstoneController(context, repo, modellingGroupRepo, mock(), mock()).getScenario()
                as ScenarioTouchstoneAndCoverageSets

        assertThat(data.touchstoneVersion).isEqualTo(openTouchstoneVersion)
        assertThat(data.scenario).isEqualTo(scenario)
        assertThat(data.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenario requires touchstones prepare permission for in-preparation touchstone`()
    {
        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(inPrepTouchstoneVersion))
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, emptyList())
        }
        val logic = mock<ScenarioLogic> {
            on { getScenario(any(), any()) } doReturn scenario
        }
        val context = mock<ActionContext> {
            on { params(":touchstone-version-id") } doReturn inPrepTouchstoneVersion.id
            on { params(":scenario-id") } doReturn scenario.id
            on { permissions } doReturn PermissionSet(listOf())
        }
        TouchstoneController(context, repo, mock(), logic, mock()).getScenario()
        verify(context).requirePermission(ReifiedPermission("touchstones.prepare", Scope.Global()))
    }

    @Test
    fun `getResponsibilities returns responsibility sets and expectations`()
    {
        val sets = listOf(
                exampleResponsibilitySetWithExpectations(openTouchstoneVersion.id, "gId"),
                exampleResponsibilitySetWithExpectations(openTouchstoneVersion.id, "gId")
        )
        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
        }
        val logic = mock<ExpectationsLogic> {
            on { it.getResponsibilitySetsWithExpectations(any()) } doReturn sets
        }
        val context = mock<ActionContext> {
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
        }
        val result = TouchstoneController(context, repo, mock(), mock(), logic).getResponsibilities()
        assertThat(result).isEqualTo(sets)
    }

    @Test
    fun `getResponsibilities requires touchstones prepare permission for in-preparation touchstone`()
    {
        val repo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(inPrepTouchstoneVersion))
        }
        val logic = mock<ExpectationsLogic> {
            on { it.getResponsibilitySetsWithExpectations(any()) } doReturn listOf(
                    exampleResponsibilitySetWithExpectations(inPrepTouchstoneVersion.id, "gId")
            )
        }
        val context = mock<ActionContext> {
            on { params(":touchstone-version-id") } doReturn inPrepTouchstoneVersion.id
        }
        TouchstoneController(context, repo, mock(), mock(), logic).getResponsibilities()
        verify(context).requirePermission(ReifiedPermission("touchstones.prepare", Scope.Global()))
    }

    @Test
    fun `getDemographicData fetches from repository`()
    {
        val demographicMetadata = DemographicDataForTouchstone(openTouchstoneVersion,
                DemographicMetadata("id", "name", null, listOf(), "people", "age", source))

        val repo = mock<TouchstoneRepository> {
            on { getDemographicData(type, source, openTouchstoneVersion.id) } doReturn
                    SplitData(demographicMetadata, DataTable.new(emptySequence()))
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
        }

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
        }

        val data = TouchstoneController(context, repo, mock(), mock(), mock()).getDemographicDataAndMetadata()
        assertThat(data.structuredMetadata).isEqualTo(demographicMetadata)
    }

    @Test
    fun `gets wide demographic data`()
    {
        val repo = getRepoWithDemographicData()

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "wide"
        }

        val data = TouchstoneController(context, repo, mock(), mock(), mock())
                .getDemographicDataAndMetadata()
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
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "long"
        }

        val data = TouchstoneController(context, repo, mock(), mock(), mock())
                .getDemographicDataAndMetadata().data

        Assertions.assertThat(data.first() is LongDemographicRow).isTrue()
    }

    @Test
    fun `throws error if supplied format is invalid`()
    {
        val repo = getRepoWithDemographicData()

        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
            on { params(":touchstone-version-id") } doReturn openTouchstoneVersion.id
            on { params(":type-code") } doReturn type
            on { params(":source-code") } doReturn source
            on { queryParams("format") } doReturn "678hj"
        }

        Assertions.assertThatThrownBy {
            TouchstoneController(context, repo, mock(), mock(), mock()).getDemographicDataAndMetadata()
        }.isInstanceOf(BadRequest::class.java)
    }

    private fun getRepoWithDemographicData(): TouchstoneRepository
    {
        val demographicMetadata = DemographicDataForTouchstone(openTouchstoneVersion,
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
            on { getDemographicData(type, source, openTouchstoneVersion.id) } doReturn
                    SplitData(demographicMetadata, DataTable.new(fakeRows))
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf(openTouchstoneVersion))
        }
    }
}
