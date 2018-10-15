package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import org.assertj.core.api.Assertions
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
    val setC = 3
    val setD = 4
    val setE = 5
    val setF = 6

    val groupId = "group-1"

    @Test
    fun `getScenario throws exception if scenario doesn't exist`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThatThrownBy { it.getScenarioAndCoverageSets(touchstoneVersionId, scenarioId) }
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
            it.addTouchstoneVersion("extra", 1, addTouchstone = true)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId, id = scenarioInTouchstoneId)
            it.addScenarioToTouchstone(touchstoneVersionId, "yf-2", id = scenarioInTouchstoneId + 1)
            it.addScenarioToTouchstone(extraTouchstoneId, scenarioId, id = scenarioInTouchstoneId + 2)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = false)
        } check {
            val result = it.getScenarioAndCoverageSets(touchstoneVersionId, "yf-1")
            checkScenarioIsAsExpected(result, listOf(extraTouchstoneId))
        }
    }

    @Test
    fun `can get ordered coverage data`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetsAndDataToScenario(it)
        } check {
            val result = it.getScenarioAndCoverageData(touchstoneVersionId, scenarioId)

            assertThat(result.structuredMetadata.coverageSets!!.count()).isEqualTo(3)

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

    @Test
    fun `can get coverage data for responsibility`()
    {
        var responsibilityId = 0
        given {
            val countries = listOf("AAA", "BBB", "CCC")
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetsAndDataToScenario(it, countries = countries)
            it.addExpectations(responsibilityId, countries = countries)
        } check {
            val result = it.getScenarioAndCoverageDataForResponsibility(responsibilityId, touchstoneVersionId, scenarioId)

            assertThat(result.structuredMetadata.coverageSets!!.count()).isEqualTo(3)
            assertThat(result.tableData.data.toList().count()).isEqualTo(7)
        }
    }


    @Test
    fun `can get ordered coverage sets`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetsToScenario(it)
        } check {
            val result = it.getScenarioAndCoverageSets(touchstoneVersionId, scenarioId)
                    .coverageSets!!

            assertThat(result.count()).isEqualTo(6)

            assertThat(result[0].id).isEqualTo(setA)
            assertThat(result[1].id).isEqualTo(setB)
            assertThat(result[2].id).isEqualTo(setC)
            assertThat(result[3].id).isEqualTo(setD)
            assertThat(result[4].id).isEqualTo(setE)
            assertThat(result[5].id).isEqualTo(setF)
        }
    }

    @Test
    fun `getScenarioAndCoverageData throws exception if scenario doesn't exist`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
        } check {
            Assertions.assertThatThrownBy { it.getScenarioAndCoverageData(touchstoneVersionId, scenarioId) }
                    .isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `can get scenario with coverage data`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = true)
        } check {
            val result = it.getScenarioAndCoverageData(touchstoneVersionId, scenarioId)
            checkScenarioIsAsExpected(result.structuredMetadata)
            assertThat(result.tableData.data.toList()).containsExactlyElementsOf(listOf(
                    LongCoverageRow(scenarioId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                            "AAA", "AAA-Name", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull()),
                    LongCoverageRow(scenarioId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN,
                            "BBB", "BBB-Name", 2001, 11.toDecimal(), 21.toDecimal(), null, null, null)
            ))
        }
    }

    @Test
    fun `can get scenario with empty coverage data`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = false)
        } check {
            val result = it.getScenarioAndCoverageData(touchstoneVersionId, scenarioId)
            checkScenarioIsAsExpected(result.structuredMetadata)
            assertThat(result.tableData.data.toList()).isEmpty()
        }
    }

    private fun checkScenarioIsAsExpected(result: ScenarioAndCoverageSets, extraTouchstones: List<String> = emptyList())
    {
        assertThat(result.scenario.description).isEqualTo("Yellow Fever 1")
        assertThat(result.scenario.id).isEqualTo("yf-1")
        assertThat(result.scenario.disease).isEqualTo("YF")
        assertThat(result.scenario.touchstones).hasSameElementsAs(listOf(touchstoneVersionId) + extraTouchstones)

        assertThat(result.coverageSets).hasSameElementsAs(listOf(
                CoverageSet(setA, touchstoneVersionId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                CoverageSet(setB, touchstoneVersionId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
        ))
    }

    private fun giveScenarioCoverageSets(db: JooqContext, scenarioId: String, includeCoverageData: Boolean)
    {
        db.addCoverageSet(touchstoneVersionId, "YF without", "YF", "without", "campaign", id = setA)
        db.addCoverageSet(touchstoneVersionId, "YF with", "YF", "with", "campaign", id = setB)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 4)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        if (includeCoverageData)
        {
            db.addCountries(listOf("AAA", "BBB"))
            db.addCoverageRow(setA, "AAA", 2000, 10.toDecimal(), 20.toDecimal(), "10-20", 100.toDecimal(), "50.50".toDecimalOrNull())
            db.addCoverageRow(setB, "BBB", 2001, 11.toDecimal(), 21.toDecimal(), null, null, null)
        }
    }

    private fun giveUnorderedCoverageSetsAndDataToScenario(db: JooqContext,
                                                           countries: List<String> = listOf("AAA", "BBB", "CCC"))
    {
        db.addCoverageSet(touchstoneVersionId, "First", "AF", "without", "routine", id = setA)
        db.addCoverageSet(touchstoneVersionId, "Second", "BF", "without", "campaign", id = setB)
        db.addCoverageSet(touchstoneVersionId, "Third", "BF", "without", "routine", id = setC)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setA, 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setB, 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneVersionId, setC, 2)

        db.addCountries(countries)

        // adding these in jumbled up order
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setB, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(setC, "BBB", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)

    }

    private fun giveUnorderedCoverageSetsToScenario(db: JooqContext)
    {
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
}