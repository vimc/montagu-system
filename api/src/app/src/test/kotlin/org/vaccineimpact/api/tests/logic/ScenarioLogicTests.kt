package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.logic.RepositoriesScenarioLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests

class ScenarioLogicTests : MontaguTests()
{
    private val touchstoneVersion = TouchstoneVersion("t-1", "t", 1, "description", TouchstoneStatus.OPEN)
    private val scenario = Scenario("id", "desc", "disease", listOf("t1, t2"))

    @Test
    fun `getScenarioTouchstoneAndCoverageSets fetches scenario without coverage sets if user has wrongly scoped coverage reading permission`()
    {
        val scenarioRepo = mock<ScenarioRepository> {
            on { getScenarioForTouchstone(any(), any()) } doReturn scenario
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(mock(), modellingGroupRepo, scenarioRepo)

        val result = sut.getScenarioTouchstoneAndCoverageSets(touchstoneVersion, scenario.id,
                listOf(Scope.Specific("modelling-group", "wrong-id")))

        assertThat(result.touchstoneVersion).isEqualTo(touchstoneVersion)
        assertThat(result.scenario).isEqualTo(scenario)
        assertThat(result.coverageSets).isNull()
    }

    @Test
    fun `getScenarioTouchstoneAndCoverageSets fetches scenario with coverage sets if user has global coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(repo, modellingGroupRepo, mock())

        val result = sut.getScenarioTouchstoneAndCoverageSets(touchstoneVersion, scenario.id,
                listOf(Scope.Global()))

        assertThat(result.touchstoneVersion).isEqualTo(touchstoneVersion)
        assertThat(result.scenario).isEqualTo(scenario)
        assertThat(result.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenarioTouchstoneAndCoverageSets fetches scenario with coverage sets if user has scoped coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(repo, modellingGroupRepo, mock())

        val result = sut.getScenarioTouchstoneAndCoverageSets(touchstoneVersion, scenario.id,
                listOf(Scope.Specific("modelling-group", "gId")))

        assertThat(result.touchstoneVersion).isEqualTo(touchstoneVersion)
        assertThat(result.scenario).isEqualTo(scenario)
        assertThat(result.coverageSets).hasSameElementsAs(coverageSets)
    }

    @Test
    fun `getScenariosAndCoverageSetsForTouchstone fetches scenarios without coverage sets if user has wrongly scoped coverage reading permission`()
    {
        val scenarioRepo = mock<ScenarioRepository> {
            on { getScenariosForTouchstone(any(), any()) } doReturn listOf(scenario)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(mock(), modellingGroupRepo, scenarioRepo)

        val result = sut.getScenariosAndCoverageSetsForTouchstone(touchstoneVersion.id,
                listOf(Scope.Specific("modelling-group", "wrong-id")),
                ScenarioFilterParameters())

        assertThat(result.all { it.coverageSets == null }).isTrue()
    }

    @Test
    fun `getScenariosAndCoverageSetsForTouchstone fetches scenarios with coverage sets if user has global coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(repo, modellingGroupRepo, mock())

        val result = sut.getScenariosAndCoverageSetsForTouchstone(touchstoneVersion.id,
                listOf(Scope.Global()),
                ScenarioFilterParameters())

        assertThat(result.all { it.coverageSets == coverageSets }).isTrue()
    }

    @Test
    fun `getScenariosAndCoverageSetsForTouchstone fetches scenarios with coverage sets if user has scoped coverage reading permission`()
    {
        val coverageSets = listOf(CoverageSet(1, "t1", "name", "vaccine", GAVISupportLevel.WITH, ActivityType.CAMPAIGN))

        val repo = mock<TouchstoneRepository> {
            on { getScenarioAndCoverageSets(any(), any()) } doReturn ScenarioAndCoverageSets(scenario, coverageSets)
        }

        val modellingGroupRepo = mock<ModellingGroupRepository> {
            on { getModellingGroupsForScenario(any()) } doReturn listOf(ModellingGroup("gId", "desc"))
        }

        val sut = RepositoriesScenarioLogic(repo, modellingGroupRepo, mock())

        val result = sut.getScenariosAndCoverageSetsForTouchstone(touchstoneVersion.id,
                listOf(Scope.Specific("modelling0-group", "gId")),
                ScenarioFilterParameters())

        assertThat(result.all { it.coverageSets == coverageSets }).isTrue()
    }
}