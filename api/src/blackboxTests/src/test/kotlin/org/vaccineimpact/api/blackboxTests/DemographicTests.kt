package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import com.github.fge.jackson.JsonLoader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.JSONSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class DemographicTests : DatabaseTest()
{
    val requiredPermissions = PermissionSet("*/can-login", "*/touchstones.read", "*/demographics.read")
    val touchstoneId = "touchstone-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1

    @Test
    fun `can get demographic stat types for touchstone`()
    {
        validate("/touchstones/$touchstoneId/demographics/") against "Demographics" given {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)

        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(1)
            Assertions.assertThat(it).contains(json {
                obj(
                        "id" to "tot-pop",
                        "name" to "tot-pop descriptive name",
                        "sources" to array("unwpp2015"),
                        "countries" to array(countries.sortedBy { it }),
                        "gender_is_applicable" to false
                )
            })
        }
    }

    @Test
    fun `can get demographic data`()
    {
        val schema = SplitSchema(json = "DemographicDatasetForTouchstone", csv = "DemographicData")
        val test = validate("/touchstones/$touchstoneId/demographics/unwpp2015/tot-pop/") against (schema) given {

            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)

        } requiringPermissions { requiredPermissions }

        test.run()
    }

    @Test
    fun `returns demographic metadata`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            setUpSupportingTables(it)
            setUpTouchstone(it)
            addPopulation(it)
            userHelper.setupTestUser(it)
        }

        val validator = SplitValidator()
        val response = requestHelper.get("/touchstones/$touchstoneId/demographics/${sources[0]}/tot-pop/",
                requiredPermissions)


        val json = JsonLoader.fromString(validator.getSplitText(response.text).json)
        val demographyJson = json["data"]["demographic_data"]

        Assertions.assertThat(demographyJson.isNull).isFalse()

//        val expectedDemographicMetadata = json { obj(
//                "id" to "tot-pop",
//                "name" to "tot-pop descriptive name",
//                "age_interpretation" to "age",
//                "source" to "unwpp2015 descriptive name",
//                "unit" to "people"
//        )}

    }

    private var countries: List<String> = listOf()
    private var sourceIds: List<Int> = listOf()
    private var sources: List<String> = listOf("unwpp2015", "unwpp2017")
    private var variantIds: List<Int> = listOf()
    private var variants = listOf("low", "medium", "high")
    private var units: List<Int> = listOf()
    private var genders: List<Int> = listOf()

    private fun setUpSupportingTables(it: JooqContext)
    {
        countries = it.generateCountries(3)
        sourceIds = it.generateDemographicSources(sources)
        variantIds = it.generateDemographicVariants(variants)
        units = it.generateDemographicUnits()
        it.generateGenders()
        it.addDisease("measles", "Measles")
    }

    private fun setUpTouchstone(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDemographicSourcesToTouchstone(touchstoneId, sourceIds)
        it.addTouchstoneCountries(touchstoneId, countries, "measles")
    }

    private fun addPopulation(it: JooqContext,
                              sources: List<Int> = sourceIds,
                              variants: List<Int> = variantIds,
                              countries: List<String> = this.countries)
    {
        val pop = it.addDemographicStatisticType("tot-pop", variantIds, units)

        for (source in sources)
        {
            for (variant in variants)
            {
                for (gender in genders)
                {
                    it.generateDemographicData(source, pop, gender,
                            variantId = variant, countries = countries, yearRange = 1950..2050 step 5)
                }
            }
        }
    }
}