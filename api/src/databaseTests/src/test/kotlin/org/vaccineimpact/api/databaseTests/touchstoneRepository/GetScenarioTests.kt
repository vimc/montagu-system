package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.`in`
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.db.toDecimalOrNull
import org.vaccineimpact.api.models.*

class GetScenarioTests : TouchstoneRepositoryTests()
{
    val setA = 1
    val setB = 2

    @Test
    fun `getScenario throws exception if scenario doesn't exist`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThatThrownBy { it.getScenario(touchstoneId, scenarioId) }
                    .isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `can get scenario with ordered coverage sets`()
    {
        val scenarioInTouchstoneId = 1
        val extraTouchstoneId = "extra-1"
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addTouchstone("extra", 1, addName = true)
            it.addScenarioToTouchstone(touchstoneId, scenarioId, id = scenarioInTouchstoneId)
            it.addScenarioToTouchstone(touchstoneId, "yf-2", id = scenarioInTouchstoneId + 1)
            it.addScenarioToTouchstone(extraTouchstoneId, scenarioId, id = scenarioInTouchstoneId + 2)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = false)
        } check {
            val result = it.getScenario(touchstoneId, "yf-1")
            checkScenarioIsAsExpected(result, listOf(extraTouchstoneId))
        }
    }

    @Test
    fun `getScenarioAndCoverageData throws exception if scenario doesn't exist`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThatThrownBy { it.getScenarioAndCoverageData(touchstoneId, scenarioId) }
                    .isInstanceOf(UnknownObjectError::class.java)
        }
}

    @Test
    fun `can get scenario with coverage data`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneId, scenarioId)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = true)
        } check {
            val result = it.getScenarioAndCoverageData(touchstoneId, scenarioId)
            checkScenarioIsAsExpected(result.structuredMetadata)
            assertThat(result.tableData.data).containsExactlyElementsOf(listOf(
                    CoverageRow(scenarioId, setA, 0, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                            "AAA", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull()),
                    CoverageRow(scenarioId, setB, 4, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN,
                            "BBB", 2001, 11.toDecimal(), 21.toDecimal(), null, null, null)
            ))
        }
    }

    private fun checkScenarioIsAsExpected(result: ScenarioAndCoverageSets, extraTouchstones: List<String> = emptyList())
    {
        assertThat(result.scenario).isEqualTo(Scenario(
                "yf-1", "Yellow Fever 1", "YF", listOf(touchstoneId) + extraTouchstones
        ))
        assertThat(result.coverageSets).hasSameElementsAs(listOf(
                CoverageSet(setA, touchstoneId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setB, touchstoneId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
        ))
    }

    private fun giveScenarioCoverageSets(db: JooqContext, scenarioId: String, includeCoverageData: Boolean)
    {
        db.addCoverageSet(touchstoneId, "YF without", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneId, "YF with", "YF", "with", "campaign", id = setB)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setB, 4)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setA, 0)
        if (includeCoverageData)
        {
            db.addCountries(listOf("AAA", "BBB"))
            db.addCoverageRow(setA, "AAA", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull())
            db.addCoverageRow(setB, "BBB", 2001, 11.toDecimal(), 21.toDecimal(), null, null, null)
        }
    }
}