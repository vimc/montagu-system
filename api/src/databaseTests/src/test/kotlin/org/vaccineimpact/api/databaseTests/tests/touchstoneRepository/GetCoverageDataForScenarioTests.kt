package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import java.math.BigDecimal
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.db.toDecimalOrNull
import org.vaccineimpact.api.models.*

class GetCoverageDataForScenarioTests : TouchstoneRepositoryTests()
{
    @Test
    fun `can get ordered coverage data for scenario`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetsAndDataToScenario(it)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            assertThat(result.toList()).containsExactlyElementsOf(listOf(
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
    fun `can get coverage sets for scenario with empty coverage data`()
    {
        given {
            val countries = listOf("AAA", "BBB", "CCC")
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            it.addCountries(countries)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = false)
        } check {
            val result = it.getCoverageSetsForScenario(touchstoneVersionId,scenarioId)

            assertThat(result).hasSameElementsAs(listOf(
                    CoverageSet(setA, touchstoneVersionId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                    CoverageSet(setB, touchstoneVersionId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            ))
        }
    }

    //////////The following tests are for aggregation of subnational campaigns/////////////////////////////////

    @Test
    fun `can get aggregated coverage data for scenario`()
    {

        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetAndDataWithDuplicatesToScenario(it)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)
            assertLongCoverageRowListEqualWithCoverageTolerance(
                    result.toList(),
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(600), BigDecimal(0.63333)),
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "BBB", "BBB-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1500), BigDecimal(0.21333)),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5)))
                    , 0.001)
        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where all group rows have target and coverage nulls`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Just check those expected nulls
            assertThat(result.toList()[0].target).isNull()
            assertThat(result.toList()[0].coverage).isNull()

            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", "1000".toDecimalOrNull(), "0.5".toDecimalOrNull()))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null target and coverage`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            assertLongCoverageRowListEqualWithCoverageTolerance(
                    result.toList(),
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2",BigDecimal(300), BigDecimal(0.46667)),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5)))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null target`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, BigDecimal(0.8))

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has coverage but no target to not contribute to either value in the aggregate
            assertLongCoverageRowListEqualWithCoverageTolerance(
                    result.toList(),
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2",BigDecimal(300), BigDecimal(0.46667)),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5)))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null coverage`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has target but no coverage to not contribute to either value in the aggregate
            assertLongCoverageRowListEqualWithCoverageTolerance(
                    result.toList(),
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2",BigDecimal(300), BigDecimal(0.46667)),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5)))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null coverage and target, another has null target`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, BigDecimal(5.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), BigDecimal(0.3))

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect only the coverage rows which have both target and coverage values to contirbute to the aggregate values
            assertLongCoverageRowListEqualWithCoverageTolerance(
                    result.toList(),
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2",BigDecimal(200), BigDecimal(0.25)),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5)))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where group has zero target`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), null) //This should get ignored

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has aggregate target zero to have aggregate coverage of null
            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2","0".toDecimalOrNull(), null),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", "1000".toDecimalOrNull(), "0.5".toDecimalOrNull()))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where group has zero target, with another row with null coverage`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), null) //This should get ignored because of null coverage

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has aggregate target zero to have aggregate coverage of null
            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2","0".toDecimalOrNull(), null),
                            LongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", "1000".toDecimalOrNull(), "0.5".toDecimalOrNull()))
            )

        }
    }

    @Test
    fun `coverage data for scenario is not aggregated for rows with different age range verbatim`()
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "one-two", BigDecimal(2), BigDecimal(0.6))

        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            assertLongCoverageRowListEqualWithCoverageTolerance(
            result.toList(),
            listOf(
                    LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2","1".toDecimalOrNull(), "0.2".toDecimalOrNull()),
                    LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "one-two","2".toDecimalOrNull(), "0.6".toDecimalOrNull())
            ))

        }
    }

    //This set of tests confirm that new SQL grouping logic in TouchstoneRepo does not interfere with cases where only
    //a single row per group is present, and where target and coverage values for that row should be output unmolested
    //whether or not they include zeroes or nulls
    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("0".toDecimalOrNull(), "0".toDecimalOrNull())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is zero, coverage is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("0".toDecimalOrNull(), null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is null, coverage is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, "0".toDecimalOrNull())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, "0.5".toDecimalOrNull())
    }

    @Test
    fun `can get expected coverage data for scenario single row, coverage is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("50".toDecimalOrNull(), null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("0".toDecimalOrNull(), "0.5".toDecimalOrNull())
    }

    @Test
    fun `can get expected coverage data for scenario single row, coverage is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("50".toDecimalOrNull(), "0".toDecimalOrNull())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are non-zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged("50".toDecimalOrNull(), "0.5".toDecimalOrNull())
    }

    private fun testSingleRowScenarioCoverageValuesAreUnchanged(target: BigDecimal?, coverage: BigDecimal?)
    {
        given{
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", target, coverage)

        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has aggregate target zero to have aggregate coverage of null
            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            LongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", target, coverage)

                    ))
        }
    }


}