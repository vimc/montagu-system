package org.vaccineimpact.api.databaseTests.tests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.*

class GetResponsibilityCoverageSetsTests : ModellingGroupRepositoryTests()
{
    val groupId = "group-1"
    val touchstoneName = "touchstoneVersion"
    val touchstoneVersion = 1
    val touchstoneVersionId = "$touchstoneName-$touchstoneVersion"
    val scenarioId = "scenario-1"
    val setA = 1
    val setB = 2
    val setC = 3
    val setD = 4
    val setE = 5
    val setF = 6

    @Test
    fun `getCoverageSets throws exception if scenario doesn't exist`()
    {
        given {
            createGroupAndSupportingObjects(it)
            it.addResponsibilitySet(groupId, touchstoneVersionId, "incomplete")
        } check {
            assertThatThrownBy { it.getCoverageSets(groupId, touchstoneVersionId, scenarioId) }
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
            val result = it.getCoverageSets(groupId, touchstoneVersionId, scenarioId)
            checkMetadataIsAsExpected(result)
        }
    }

    @Test
    fun `getCoverageData throws exception if scenario doesn't exist`()
    {
        given {
            createGroupAndSupportingObjects(it)
            it.addResponsibilitySet(groupId, touchstoneVersionId, "incomplete")
        } check {
            assertThatThrownBy { it.getCoverageData(groupId, touchstoneVersionId, scenarioId) }
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
            val result = it.getCoverageData(groupId, touchstoneVersionId, scenarioId)

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
        assertThat(result.touchstoneVersion).isEqualTo(TouchstoneVersion(
                touchstoneVersionId, touchstoneName, touchstoneVersion,
                "description", TouchstoneStatus.OPEN
        ))
        assertThat(result.scenario).isEqualTo(Scenario(
                scenarioId, "Yellow Fever Scenario", "YF", listOf(touchstoneVersionId)
        ))
        assertThat(result.coverageSets).containsExactlyElementsOf(listOf(
                CoverageSet(setA, touchstoneVersionId, "First", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setB, touchstoneVersionId, "Second", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN),
                CoverageSet(setC, touchstoneVersionId, "Third", "YF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN),
                CoverageSet(setD, touchstoneVersionId, "Fourth", "BF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN),
                CoverageSet(setE, touchstoneVersionId, "Fifth", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setF, touchstoneVersionId, "Sixth", "BF", GAVISupportLevel.BESTMINUS, ActivityType.CAMPAIGN)
        ))
    }

    private fun createGroupAndSupportingObjects(db: JooqContext)
    {
        db.addGroup(groupId, "description")
        db.addTouchstoneVersion(touchstoneName, touchstoneVersion, "description", "open",
                addTouchstone = true)
        db.addScenarioDescription(scenarioId, "Yellow Fever Scenario", "YF", addDisease = true)
        db.addVaccine("YF", "Yellow Fever")
        db.addVaccine("BF", "Blue Fever")
        db.addVaccine("AF", "Alpha Fever")
    }

    private fun giveCoverageSetsToResponsibility(db: JooqContext)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneVersionId, "incomplete")
        db.addResponsibility(setId, touchstoneVersionId, scenarioId)
        db.addCoverageSet(touchstoneVersionId, "First", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneVersionId, "Second", "YF", "with", "campaign", id = setB)
        db.addCoverageSet(touchstoneVersionId, "Third", "YF", "bestminus", "campaign", id = setC)
        db.addCoverageSet(touchstoneVersionId, "Fourth", "BF", "with", "campaign", id = setD)
        db.addCoverageSet(touchstoneVersionId, "Fifth", "BF", "without", "campaign", id = setE)
        db.addCoverageSet(touchstoneVersionId, "Sixth", "BF", "bestminus", "campaign", id = setF)

        // Deliberately out of order, to check ordering logic later
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setF, 5)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setC, 2)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setD, 3)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setE, 4)

    }

    private fun giveCoverageSetsAndDataToResponsibility(db: JooqContext)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneVersionId, "incomplete")
        db.addResponsibility(setId, touchstoneVersionId, scenarioId)
        db.addCoverageSet(touchstoneVersionId, "First", "AF", "without", "routine", id = setA)
        db.addCoverageSet(touchstoneVersionId, "Second", "BF", "without", "campaign", id = setB)
        db.addCoverageSet(touchstoneVersionId, "Third", "BF", "without", "routine", id = setC)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setC, 2)

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