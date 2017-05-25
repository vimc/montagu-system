package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetResponsibilityCoverageSetsTests : ModellingGroupRepositoryTests()
{
    val groupId = "group-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneId = "$touchstoneName-$touchstoneVersion"
    val scenarioId = "scenario-1"

    @org.junit.Test
    fun `getCoverageSets throws exception if scenario doesn't exist`()
    {
        given {
            createGroupAndSupportingObjects(it)
            it.addResponsibilitySet(groupId, touchstoneId, "incomplete", addStatus = true)
        } check {
            assertThatThrownBy { it.getCoverageSets(groupId, touchstoneId, scenarioId) }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @org.junit.Test
    fun `can get ordered coverage sets`()
    {
        val setA = 1
        val setB = 2
        given {
            createGroupAndSupportingObjects(it)
            val setId = it.addResponsibilitySet(groupId, touchstoneId, "incomplete", addStatus = true)
            it.addResponsibility(setId, touchstoneId, scenarioId)
            it.addCoverageSet(touchstoneId, "First", "YF", "without", "campaign", id = setA)
            it.addCoverageSet(touchstoneId, "Second", "YF", "with", "campaign", id = setB)
            it.addCoverageSetToScenario(scenarioId, touchstoneId, setB, 1)
            it.addCoverageSetToScenario(scenarioId, touchstoneId, setA, 0)
        } check {
            val result = it.getCoverageSets(groupId, touchstoneId, scenarioId)
            assertThat(result.touchstone).isEqualTo(org.vaccineimpact.api.models.Touchstone(
                    touchstoneId, touchstoneName, touchstoneVersion,
                    "description", YearRange(1900, 2000), TouchstoneStatus.OPEN
            ))
            assertThat(result.scenario).isEqualTo(org.vaccineimpact.api.models.Scenario(
                    scenarioId, "Yellow Fever Scenario", "YF", listOf(touchstoneId)
            ))
            assertThat(result.coverageSets).hasSameElementsAs(listOf(
                    org.vaccineimpact.api.models.CoverageSet(setA, touchstoneId, "First", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                    org.vaccineimpact.api.models.CoverageSet(setB, touchstoneId, "Second", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            ))
        }
    }

    private fun createGroupAndSupportingObjects(it: org.vaccineimpact.api.db.JooqContext)
    {
        it.addGroup(groupId, "description")

        it.addTouchstone(touchstoneName, touchstoneVersion, "description", "open", 1900..2000,
                addName = true, addStatus = true)
        it.addScenarioDescription(scenarioId, "Yellow Fever Scenario", "YF", addDisease = true)

        it.addSupportLevels("none", "without", "with")
        it.addActivityTypes("none", "routine", "campaign")
        it.addVaccine("YF", "Yellow Fever")
    }
}