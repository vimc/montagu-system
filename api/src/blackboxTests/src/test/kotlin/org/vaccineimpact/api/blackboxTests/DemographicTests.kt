package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import com.github.fge.jackson.JsonLoader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.test_helpers.DemographicDummyData
import org.vaccineimpact.api.validateSchema.JSONValidator

class DemographicTests : DatabaseTest()
{
    val requiredPermissions = PermissionSet("*/can-login", "*/touchstones.read", "*/demographics.read")
    val touchstoneId = "touchstone-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val url = "/touchstones/$touchstoneId/demographics/unwpp2015/tot-pop/"

    @Test
    fun `can get demographic stat types for touchstone`()
    {
        var countries: List<String> = listOf()

        validate("/touchstones/$touchstoneId/demographics/") against "Demographics" given {

            countries = DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .countries

        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(1)
            Assertions.assertThat(it).contains(json {
                obj(
                        "id" to "tot-pop",
                        "name" to "tot-pop descriptive name",
                        "sources" to array("unwpp2015", "unwpp2017"),
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
        val test = validate(url) against (schema) given {

            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()

        } requiringPermissions { requiredPermissions }

        test.run()
    }

    @Test
    fun `returns demographic metadata`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        var countries: List<String> = listOf()

        JooqContext().use {

            countries = DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()
                    .countries

            userHelper.setupTestUser(it)
        }

        val validator = SplitValidator()
        val response = requestHelper.get(url, requiredPermissions)

        val json = JsonLoader.fromString(validator.getSplitText(response.text).json)
        val demographyJson = json["data"]["demographic_data"]

        val expectedDemographicMetadata = JsonLoader.fromString(json {
            obj(
                    "id" to "tot-pop",
                    "name" to "tot-pop descriptive name",
                    "age_interpretation" to "age",
                    "source" to "unwpp2015",
                    "unit" to "Number of people",
                    "gender" to "Both",
                    "countries" to array(countries.sortedBy { it })
            )
        }.toJsonString())

        Assertions.assertThat(demographyJson).isEqualTo(expectedDemographicMetadata)
    }

    @Test
    fun `returns gendered data when gender query parameter passed`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        var countries: List<String> = listOf()

        JooqContext().use {

            countries = DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation(genderIsApplicable = true)
                    .countries

            userHelper.setupTestUser(it)
        }

        val validator = SplitValidator()
        val response = requestHelper.get("$url?gender=female", requiredPermissions)

        val json = JsonLoader.fromString(validator.getSplitText(response.text).json)
        val demographyJson = json["data"]["demographic_data"]

        val expectedDemographicMetadata = JsonLoader.fromString(json {
            obj(
                    "id" to "tot-pop",
                    "name" to "tot-pop descriptive name",
                    "age_interpretation" to "age",
                    "source" to "unwpp2015",
                    "unit" to "Number of people",
                    "gender" to "Female",
                    "countries" to array(countries.sortedBy { it })
            )
        }.toJsonString())

        Assertions.assertThat(demographyJson).isEqualTo(expectedDemographicMetadata)
    }

    @Test
    fun `can get pure CSV demographic data for touchstone`()
    {
        val schema = CSVSchema("DemographicData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {

            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()

            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, requiredPermissions, contentType = "text/csv")
        schema.validate(response.text)
    }

    @Test
    fun `can get pure CSV demographic data via one time link`()
    {
        validate("$url/get_onetime_link/") against "Token" given {

            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation()

        } requiringPermissions { requiredPermissions } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val schema = CSVSchema("DemographicData")
            val requestHelper = RequestHelper()
            val response = requestHelper.get(oneTimeURL)
            val body = schema.validate(response.text)
            Assertions.assertThat(body.count()).isGreaterThan(0)

            val badResponse =  requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }


    @Test
    fun `can get gendered CSV demographic data via one time link`()
    {
        validate("$url/get_onetime_link/?gender=female") against "Token" given {

            DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation(genderIsApplicable = true)

        } requiringPermissions { requiredPermissions } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val schema = CSVSchema("DemographicData")
            val requestHelper = RequestHelper()
            val response = requestHelper.get(oneTimeURL)
            val body = schema.validate(response.text)

            Assertions.assertThat(body.all{ it[6] == "Female" }).isTrue()
        }
    }


    @Test
    fun `returns demographic data csv`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        var expectedRows = 0

        JooqContext().use {

            val data = DemographicDummyData(it)
                    .withTouchstone(touchstoneName, touchstoneVersion)
                    .withPopulation(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)

            val numYears = 2
            val numAges = 2

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2

            val numCountries = data.countries.count()

            expectedRows = numAges * numYears * numCountries * numVariants
        }

        val validator = SplitValidator()
        val response = requestHelper.get("/touchstones/$touchstoneId/demographics/unwpp2015/tot-pop/",
                requiredPermissions)

        val csv = validator.getSplitText(response.text).csv
        val CSVSchema = CSVSchema("DemographicData")
        val body = CSVSchema.validate(csv)

        Assertions.assertThat(body.count()).isEqualTo(expectedRows)
    }

}