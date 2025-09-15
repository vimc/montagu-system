package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import java.math.BigDecimal
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.*

class GetCoverageDataForScenarioTests : TouchstoneRepositoryTests()
{
    @Test
    fun `can get ordered coverage data for scenario for 2019 touchstone`()
    {
        canGetOrderedCoverageDataForScenario(touchstoneName2019)
    }

    @Test
    fun `can get ordered coverage data for scenario for 2020 touchstone`()
    {
        canGetOrderedCoverageDataForScenario(touchstoneName2020)
    }

    private fun canGetOrderedCoverageDataForScenario(touchstoneName: String)
    {
        val touchstoneVersion = "$touchstoneName-1"
        given {
            createTouchstoneAndScenarioDescriptions(it, touchstoneName)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            giveUnorderedCoverageSetsAndDataToScenario(it, touchstoneVersion=touchstoneVersion)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersion, scenarioId)

            assertThat(result.toList()).containsExactlyElementsOf(listOf(
                    GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null, "both"),
                    // first order by vaccine
                    GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                            "AAA", "AAA-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null, "both"),
                    // then by activity type
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "AAA", "AAA-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null, "both"),
                    // then by country
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null, "both"),
                    // then by year
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null, "both"),
                    // then by age first
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null, "both"),
                    // then by age last
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                            "BBB", "BBB-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null, "both"),
                    // then by age last
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                    "BBB", "BBB-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null, "female")

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
            val result = it.getCoverageSetsForScenario(touchstoneVersionId, scenarioId)

            assertThat(result).hasSameElementsAs(listOf(
                    CoverageSet(setA, touchstoneVersionId, "YF without", "YF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN),
                    CoverageSet(setB, touchstoneVersionId, "YF with", "YF", GAVISupportLevel.WITH, ActivityType.CAMPAIGN)
            ))
        }
    }

    @Test
    fun `can get aggregated coverage data for scenario`()
    {

        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            giveUnorderedCoverageSetAndDataWithDuplicatesToScenario(it)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(600), 0.63333333333333333333.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "BBB", "BBB-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1500), 0.2133333333333333333.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.123.toDecimal(), "both"))
            )
        }
    }

    @Test
    fun `can get default gender of 'both' from coverage with null gender values for 2019 touchstone`()
    {
        canGetDefaultGenderBoth(touchstoneName2019)
    }

    @Test
    fun `can get default gender of 'both' from coverage with null gender values for 2020 touchstone`()
    {
        canGetDefaultGenderBoth(touchstoneName2020)
    }

    private fun canGetDefaultGenderBoth(touchstoneName: String)
    {
        val touchstoneVersion = "$touchstoneName-1"
        given {
            createTouchstoneAndScenarioDescriptions(it, touchstoneName)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "AF", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            it.addCountries(listOf("AAA"))

            it.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), BigDecimal(0.5), null)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersion, scenarioId)
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), 0.5.toDecimal(), "both")
                           )
            )
        }
    }

    @Test
    fun `can get default gender of 'female' for HPV coverage data for 2019 touchstone`()
    {
        canGetDefaultGenderFemale(touchstoneName2019)
    }

    @Test
    fun `can get default gender of 'female' for HPV coverage data for 2020 touchstone`()
    {
        canGetDefaultGenderFemale(touchstoneName2020)
    }

    private fun canGetDefaultGenderFemale(touchstoneName: String)
    {
        val touchstoneVersion = "$touchstoneName-1"
        given {
            it.addTouchstoneVersion(touchstoneName, 1, addTouchstone = true)
            it.addDisease("HPV", "HPV")
            it.addScenarioDescription(scenarioId, "HPV 1", "HPV")
            it.addVaccine("HPV", "HPV")

            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "HPV", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            it.addCountries(listOf("AAA"))
            it.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), BigDecimal(0.5), null)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersion, scenarioId)
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "HPV", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), 0.5.toDecimal(), "female")
                    )
            )
        }
    }

    @Test
    fun `can get coverage results without gender for pre-2019 touchstones`()
    {
        val touchstone = "201810-test"
        val touchstoneVersion = "$touchstone-1"
        given {
            createTouchstoneAndScenarioDescriptions(it, touchstone)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "AF", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            it.addCountries(listOf("AAA"))

            it.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), BigDecimal(0.5), null)
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersion, scenarioId)
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            NoGenderLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), 0.5.toDecimal())
                    )
            )
        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where all group rows have target and coverage nulls`()
    {
        given {
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
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null, "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null target and coverage`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.6.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), 0.466666666666.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null target`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.25.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.65.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, 0.8.toDecimal())

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has coverage but no target to not contribute to either value in the aggregate
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), 0.516666666666.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null coverage`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 100.toDecimal(), 0.123.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 200.toDecimal(), 0.678.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 500.toDecimal(), null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has target but no coverage to not contribute to either value in the aggregate
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 300.toDecimal(), 0.493.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where one group row has null coverage and target, another has null target`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 100.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, 5.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 100.toDecimal(), 0.3.toDecimal())

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect only the coverage rows which have both target and coverage values to contirbute to the aggregate values
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 200.toDecimal(), 0.25.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where group has zero target`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.6.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 500.toDecimal(), null) //This should get ignored

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has aggregate target zero to have aggregate coverage of null
            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), null, "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for scenario where group has zero target, with another row with null coverage`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.6.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 500.toDecimal(), null) //This should get ignored because of null coverage

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            //Expect the coverage row which has aggregate target zero to have aggregate coverage of null
            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), null, "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `coverage data for scenario is not aggregated for rows with different age range verbatim`()
    {
        given {
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 1.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "one-two", 2.toDecimal(), 0.6.toDecimal())

        } check {
            val result = it.getCoverageDataForScenario(touchstoneVersionId, scenarioId)

            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 1.toDecimal(), 0.2.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "one-two", 2.toDecimal(), 0.6.toDecimal(), "both")
                    ))

        }
    }

    //This set of tests confirm that new SQL grouping logic in TouchstoneRepo does not interfere with cases where only
    //a single row per group is present, and where target and coverage values for that row should be output unmolested
    //whether or not they include zeroes or nulls
    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(0.toDecimal(), 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is zero, coverage is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(0.toDecimal(), null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is null, coverage is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(null, 0.5.toDecimal())
    }

    @Test
    fun `can get expected coverage data for scenario single row, coverage is null`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(50.toDecimal(), null)
    }

    @Test
    fun `can get expected coverage data for scenario single row, target is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(0.toDecimal(), 0.5.toDecimal())
    }

    @Test
    fun `can get expected coverage data for scenario single row, coverage is zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(50.toDecimal(), 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for scenario single row, target and coverage are non-zero`()
    {
        testSingleRowScenarioCoverageValuesAreUnchanged(50.toDecimal(), 0.5.toDecimal())
    }

    private fun testSingleRowScenarioCoverageValuesAreUnchanged(target: BigDecimal?, coverage: BigDecimal?)
    {
        given {
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
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", target, coverage, "both")

                    ))
        }
    }


}