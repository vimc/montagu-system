package org.vaccineimpact.api.databaseTests.tests.touchstoneRepository

import java.math.BigDecimal
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.*

class GetCoverageDataForResponsibilityTests : TouchstoneRepositoryTests()
{
    @Test
    fun `can get ordered coverage data for responsibility for 2019 touchstone`()
    {
        canGetOrderedCoverageDataForResponsibility(touchstoneName2019)
    }

    @Test
    fun `can get ordered coverage data for responsibility for 2020 touchstone`()
    {
        canGetOrderedCoverageDataForResponsibility(touchstoneName2020)
    }

    private fun canGetOrderedCoverageDataForResponsibility(touchstoneName: String)
    {
        val touchstoneVersion = "$touchstoneName-1"
        var responsibilityId = 0
        given {
            val countries = listOf("AAA", "BBB")
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it, touchstoneName)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersion, scenarioId)

            it.addCountries(countries)
            giveUnorderedCoverageSetsAndDataToScenario(it, addCountries = false, touchstoneVersion = touchstoneVersion)
            it.addExpectations(responsibilityId, countries = countries)

            // add extra data
            it.addGroup("bad-group")
            it.addResponsibilityInNewSet("bad-group", touchstoneVersion, scenarioId)
            it.addScenarioToTouchstone(touchstoneVersion, "yf-2")
            it.addTouchstoneVersion(touchstoneName, 2, addTouchstone = false)
            it.addScenarioToTouchstone("$touchstoneName-2", scenarioId)

        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersion,
                    responsibilityId,
                    scenarioId)

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
                    // then by gender
                    GenderedLongCoverageRow(scenarioId, "Third", "BF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                    "BBB", "BBB-Name", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null, "female")

            ))
        }
    }

    @Test
    fun `get coverage data for responsibility only returns expectations countries`()
    {
        var responsibilityId = 0
        given {
            val countries = listOf("AAA", "BBB", "CCC", "DDD")
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)
            it.addCountries(countries)
            giveUnorderedCoverageSetsAndDataToScenario(it, addCountries = false)
            it.addExpectations(responsibilityId, countries = countries.subList(1, 3))
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            assertThat(result.toList().count()).isEqualTo(5)
        }
    }

    @Test
    fun `can get coverage data for responsibility with empty coverage data`()
    {
        var responsibilityId = 0
        given {
            val countries = listOf("AAA", "BBB", "CCC")
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)
            it.addCountries(countries)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = false)
            it.addExpectations(responsibilityId, countries = countries)
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId,
                    scenarioId)

            assertThat(result.toList()).isEmpty()
        }
    }

    @Test
    fun `can get coverage data for responsibility with no expectations`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)
            giveScenarioCoverageSets(it, scenarioId, includeCoverageData = true)
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            assertThat(result.toList()).isEmpty()
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
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it, touchstoneName)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "AF", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            val countries = listOf("AAA")
            it.addCountries(countries)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersion, scenarioId)
            it.addExpectations(responsibilityId, countries = countries)

            it.addCoverageRow(setA, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), "2-4", BigDecimal(600), BigDecimal(0.5), null)
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersion, responsibilityId, scenarioId)
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
        var responsibilityId: Int
        given {
            it.addGroup(groupId)
            it.addTouchstoneVersion(touchstoneName, 1, addTouchstone = true)
            it.addDisease("HPV", "HPV")
            it.addScenarioDescription(scenarioId, "HPV 1", "HPV")
            it.addVaccine("HPV", "HPV")

            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "HPV", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            val countries = listOf("AAA")
            it.addCountries(countries)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersion, scenarioId)
            it.addExpectations(responsibilityId, countries = countries)

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
        var responsibilityId: Int
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it, touchstone)
            it.addScenarioToTouchstone(touchstoneVersion, scenarioId)
            it.addCoverageSet(touchstoneVersion, "First", "AF", "without", "routine", id = setA)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersion, setA, 0)
            val countries = listOf("AAA")
            it.addCountries(countries)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersion, scenarioId)
            it.addExpectations(responsibilityId, countries = countries)

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

    //////////The following tests are for aggregation of subnational campaigns/////////////////////////////////

    @Test
    fun `can get aggregated coverage data for responsibility`()
    {
        var responsibilityId = 0
        given {
            val countries = listOf("AAA", "BBB")
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            it.addCountries(countries)
            giveUnorderedCoverageSetAndDataWithDuplicatesToScenario(it, addCountries = false)
            it.addExpectations(responsibilityId, countries = countries)

        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId).toList()

            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(600), 0.6333333333.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "BBB", "BBB-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1500), 0.2133333333.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.123.toDecimal(), "both")
                    ))

        }

    }

    @Test
    fun `can get expected aggregated coverage data for responsibility where all group rows have target and coverage nulls`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

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
    fun `can get expected aggregated coverage data for responsibility where one group row has null target and coverage`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.23.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.68.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), 0.53.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for responsibility where one group row has null target`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.6.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, 0.8.toDecimal())

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            //Expect the coverage row which has coverage but no target to not contribute to either value in the aggregate
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), 0.4666666667.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected grouped coverage data for responsibility where one group row has null coverage`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.12.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.63.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), null)

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            //Expect the coverage row which has target but no coverage to not contribute to either value in the aggregate
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(300), 0.46.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for responsibility where one group row has null coverage and target, another has null target`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.21.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, null)
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", null, BigDecimal(5.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(100), 0.65.toDecimal())

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            //Expect only the coverage rows which have both target and coverage values to contirbute to the aggregate values
            assertLongCoverageRowListEqual(
                    result.toList(),
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(200), 0.43.toDecimal(), "both"),
                            GenderedLongCoverageRow(scenarioId, "Second", "BF", GAVISupportLevel.WITHOUT, ActivityType.CAMPAIGN,
                                    "BBB", "BBB-Name", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), 0.5.toDecimal(), "both"))
            )

        }
    }

    @Test
    fun `can get expected aggregated coverage data for responsibility where group has zero target`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.2))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(0), BigDecimal(0.6))
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(500), null) //This should get ignored

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", BigDecimal(1000), BigDecimal(0.5))
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

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
    fun `can get expected grouped coverage data for responsibility where group has zero target, with another row with null coverage`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 0.toDecimal(), 0.6.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 500.toDecimal(), null) //This should get ignored because of null coverage

            //Make sure other groups aren't affected
            it.addCoverageRow(setB, "BBB", 2002, 1.toDecimal(), 2.toDecimal(), "1-2", 1000.toDecimal(), 0.5.toDecimal())
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

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
    fun `coverage data for responsibility is not aggregated for rows with different age range verbatim`()
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", 1.toDecimal(), 0.2.toDecimal())
            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "one-two", 2.toDecimal(), 0.6.toDecimal())

        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

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
    fun `can get expected coverage data for responsibility single row, target and coverage are zero`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(0.toDecimal(), 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target is zero, coverage is null`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(0.toDecimal(), null)
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target is null, coverage is zero`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(null, 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target and coverage are null`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(null, null)
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target is null`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(null, 0.5.toDecimal())
    }

    @Test
    fun `can get expected coverage data for responsibility single row, coverage is null`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(50.toDecimal(), null)
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target is zero`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(0.toDecimal(), 0.5.toDecimal())
    }

    @Test
    fun `can get expected coverage data for responsibility single row, coverage is zero`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(50.toDecimal(), 0.toDecimal())
    }

    @Test
    fun `can get expected coverage data for responsibility single row, target and coverage are non-zero`()
    {
        testSingleRowResponsibilityCoverageValuesAreUnchanged(50.toDecimal(), 0.5.toDecimal())
    }

    private fun testSingleRowResponsibilityCoverageValuesAreUnchanged(target: BigDecimal?, coverage: BigDecimal?)
    {
        var responsibilityId = 0
        given {
            it.addGroup(groupId)
            createTouchstoneAndScenarioDescriptions(it)
            it.addScenarioToTouchstone(touchstoneVersionId, scenarioId)
            responsibilityId = it.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)

            addABCoverageSets(it)
            addABCountries(it)
            it.addExpectations(responsibilityId, countries = listOf("AAA", "BBB"))

            it.addCoverageRow(setA, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", target, coverage)
        } check {
            val result = it.getCoverageDataForResponsibility(touchstoneVersionId, responsibilityId, scenarioId)

            assertThat(result.toList()).containsExactlyElementsOf(
                    listOf(
                            GenderedLongCoverageRow(scenarioId, "First", "AF", GAVISupportLevel.WITHOUT, ActivityType.ROUTINE,
                                    "AAA", "AAA-Name", 2001, 1.toDecimal(), 2.toDecimal(), "1-2", target, coverage, "both")
                    ))

        }
    }


}