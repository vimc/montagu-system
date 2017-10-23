package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.db.toDecimalOrNull
import org.vaccineimpact.api.models.*

class GetResponsibilityCoverageSetsTests : ModellingGroupRepositoryTests()
{
    val groupId = "group-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneId = "$touchstoneName-$touchstoneVersion"
    val scenarioId = "scenario-1"
    val setA = 1
    val setB = 2
    val setC = 3

    @Test
    fun `getCoverageSets throws exception if scenario doesn't exist`()
    {
        given {
            createGroupAndSupportingObjects(it)
            it.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        } check {
            assertThatThrownBy { it.getCoverageSets(groupId, touchstoneId, scenarioId) }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `can get ordered coverage sets`()
    {
        given {
            createGroupAndSupportingObjects(it)
            giveCoverageSetsToResponsibility(it, includeCoverageData = false)
        } check {
            val result = it.getCoverageSets(groupId, touchstoneId, scenarioId)
            checkMetadataIsAsExpected(result)
        }
    }

    @Test
    fun `getCoverageData throws exception if scenario doesn't exist`()
    {
        given {
            createGroupAndSupportingObjects(it)
            it.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        } check {
            assertThatThrownBy { it.getCoverageData(groupId, touchstoneId, scenarioId) }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `can get coverage data`()
    {
        given {
            createGroupAndSupportingObjects(it)
            giveCoverageSetsToResponsibility(it, includeCoverageData = true)
        } check {
            val result = it.getCoverageData(groupId, touchstoneId, scenarioId)
            checkMetadataIsAsExpected(result.structuredMetadata)
            assertThat(result.tableData.data).containsExactlyElementsOf(listOf(
                    LongCoverageRow(scenarioId, "First", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                            "AAA", "AAA-Name", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull()),
                    LongCoverageRow(scenarioId, "Second", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN,
                            "BBB", "BBB-Name", 2000, 11.toDecimal(), 21.toDecimal(), null, null, null),
                    LongCoverageRow(scenarioId, "Third", "YF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN,
                            "BBB", "BBB-Name", 2001, 12.toDecimal(), 22.toDecimal(), null, null, null)
            ))
        }
    }

    private fun checkMetadataIsAsExpected(result: ScenarioTouchstoneAndCoverageSets)
    {
        assertThat(result.touchstone).isEqualTo(Touchstone(
                touchstoneId, touchstoneName, touchstoneVersion,
                "description", TouchstoneStatus.OPEN
        ))
        assertThat(result.scenario).isEqualTo(Scenario(
                scenarioId, "Yellow Fever Scenario", "YF", listOf(touchstoneId)
        ))
        assertThat(result.coverageSets).hasSameElementsAs(listOf(
                CoverageSet(setA, touchstoneId, "First", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setB, touchstoneId, "Second", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN),
                CoverageSet(setC, touchstoneId, "Third", "YF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN)
        ))
    }

    private fun createGroupAndSupportingObjects(db: JooqContext)
    {
        db.addGroup(groupId, "description")
        db.addTouchstone(touchstoneName, touchstoneVersion, "description", "open",
                addName = true)
        db.addScenarioDescription(scenarioId, "Yellow Fever Scenario", "YF", addDisease = true)
        db.addVaccine("YF", "Yellow Fever")
    }

    private fun giveCoverageSetsToResponsibility(db: JooqContext, includeCoverageData: Boolean)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "First", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneId, "Second", "YF", "with", "campaign", id = setB)
        db.addCoverageSet(touchstoneId, "Third", "YF", "bestminus", "campaign", id = setC)
        // Deliberately out of order, to check ordering logic later
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setC, 2)

        if (includeCoverageData)
        {
            db.addCountries(listOf("AAA", "BBB"))
            db.addCoverageRow(setA, "AAA", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull())
            db.addCoverageRow(setB, "BBB", 2000, 11.toDecimal(), 21.toDecimal(), null, null, null)
            db.addCoverageRow(setC, "BBB", 2001, 12.toDecimal(), 22.toDecimal(), null, null, null)
        }
    }
}