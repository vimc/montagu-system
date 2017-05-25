package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.direct.addCoverageSet
import org.vaccineimpact.api.db.direct.addCoverageSetToScenario
import org.vaccineimpact.api.db.direct.addScenarioToTouchstone
import org.vaccineimpact.api.db.direct.addTouchstone
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.CoverageSet
import org.vaccineimpact.api.models.GAVISupportLevel
import org.vaccineimpact.api.models.Scenario

class GetScenarioTests : TouchstoneRepositoryTests()
{
    @Test
    fun `getScenario throws exception if scenario doesn't exist`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThatThrownBy { it.getScenario(touchstoneId, "yf-1") }
                    .isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `can get scenario with ordered coverage sets`()
    {
        val scenarioId = 1
        val setA = 1
        val setB = 2
        val extraTouchstoneId = "extra-1"
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addTouchstone("extra", 1, addName = true)
            it.addScenarioToTouchstone(touchstoneId, "yf-1", id = scenarioId)
            it.addScenarioToTouchstone(touchstoneId, "yf-2", id = scenarioId + 1)
            it.addScenarioToTouchstone(extraTouchstoneId, "yf-1", id = scenarioId + 2)
            it.addCoverageSet(touchstoneId, "YF without", "YF", "without", "campaign", id = setA)
            it.addCoverageSet(touchstoneId, "YF with", "YF", "with", "campaign", id = setB)
            it.addCoverageSetToScenario(scenarioId, setB, 4)
            it.addCoverageSetToScenario(scenarioId, setA, 0)
        } check {
            val result = it.getScenario(touchstoneId, "yf-1")
            Assertions.assertThat(result.scenario).isEqualTo(Scenario(
                    "yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId, extraTouchstoneId)
            ))
            Assertions.assertThat(result.coverageSets).hasSameElementsAs(listOf(
                    CoverageSet(setA, touchstoneId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                    CoverageSet(setB, touchstoneId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            ))
        }
    }
}