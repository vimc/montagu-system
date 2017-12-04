package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

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
    val setD = 4
    val setE = 5
    val setF = 6
    val setG = 7

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
            giveCoverageSetsToResponsibility(it)
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
    fun `can get ordered coverage data`()
    {
        given {
            createGroupAndSupportingObjects(it)
            giveCoverageSetsAndDataToResponsibility(it)
        } check {
            val result = it.getCoverageData(groupId, touchstoneId, scenarioId)

            assertThat(result.structuredMetadata.coverageSets.count()).isEqualTo(3)

            assertThat(result.tableData.data.toList()).containsExactlyElementsOf(listOf(
                    LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null),
                    // first order by vaccine
                    LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                            "AAA", "AAA-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null),
                    // then by activity type
                    LongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null),
                    // then by country
                    LongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null),
                    // then by year
                    LongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null),
                    // then by age first
                    LongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null),
                    // then by age last
                    LongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)

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
        assertThat(result.coverageSets).containsExactlyElementsOf(listOf(
                CoverageSet(setA, touchstoneId, "First", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setB, touchstoneId, "Second", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN),
                CoverageSet(setC, touchstoneId, "Third", "YF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN),
                CoverageSet(setD, touchstoneId, "Fourth", "BF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN),
                CoverageSet(setE, touchstoneId, "Fifth", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setF, touchstoneId, "Sixth", "BF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN)
        ))
    }

    private fun createGroupAndSupportingObjects(db: JooqContext)
    {
        db.addGroup(groupId, "description")
        db.addTouchstone(touchstoneName, touchstoneVersion, "description", "open",
                addName = true)
        db.addScenarioDescription(scenarioId, "Yellow Fever Scenario", "YF", addDisease = true)
        db.addVaccine("YF", "Yellow Fever")
        db.addVaccine("BF", "Blue Fever")
        db.addVaccine("AF", "Alpha Fever")
    }

    private fun giveCoverageSetsToResponsibility(db: JooqContext)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "First", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneId, "Second", "YF", "with", "campaign", id = setB)
        db.addCoverageSet(touchstoneId, "Third", "YF", "bestminus", "campaign", id = setC)
        db.addCoverageSet(touchstoneId, "Fourth", "BF", "with", "campaign", id = setD)
        db.addCoverageSet(touchstoneId, "Fifth", "BF", "without", "campaign", id = setE)
        db.addCoverageSet(touchstoneId, "Sixth", "BF", "bestminus", "campaign", id = setF)

        // Deliberately out of order, to check ordering logic later
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setC, 2)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setD, 3)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setE, 4)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setF, 5)

    }

    private fun giveCoverageSetsAndDataToResponsibility(db: JooqContext)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "First", "AF", "without", "routine", id = setA)
        db.addCoverageSet(touchstoneId, "Second", "BF", "without", "campaign", id = setB)
        db.addCoverageSet(touchstoneId, "Third", "BF", "without", "routine", id = setC)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, setC, 2)

        db.addCountries(listOf("AAA", "BBB", "CCC"))

        // adding these in jumbled up order
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setB, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)

    }
}