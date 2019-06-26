package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import com.github.fge.jackson.JsonLoader
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
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
    val touchstoneVersionId = "touchstone-1"
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val url = "/touchstones/$touchstoneVersionId/demographics/unwpp2015/tot-pop/"
    val fertilityUrl = "/touchstones/$touchstoneVersionId/demographics/unwpp2015/as-fert/"

    @Test
    fun `can get demographic stat types for touchstone`()
    {
        validate("/touchstones/$touchstoneVersionId/demographics/") against "Demographics" given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation()

        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(1)
            Assertions.assertThat(it).contains(json {
                obj(
                        "id" to "tot-pop",
                        "name" to "tot-pop descriptive name",
                        "source" to "unwpp2015",
                        "gender_is_applicable" to false
                )
            })
        }
    }

    @Test
    fun `can get demographic data`()
    {
        val schema = SplitSchema(json = "DemographicDataForTouchstone", csv = "DemographicData")
        val test = validate(url) against (schema) given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation()

        } requiringPermissions { requiredPermissions }

        test.run()
    }

    @Test
    fun `can get wide demographic data`()
    {
        val schema = SplitSchema(json = "DemographicDataForTouchstone", csv = "WideDemographicData")
        val test = validate("$url?format=wide") against (schema) given {

            DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
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

            countries = DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
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
                    "gender" to "both",
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

            countries = DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withFertility()
                    .countries

            userHelper.setupTestUser(it)
        }

        val validator = SplitValidator()
        val response = requestHelper.get("$fertilityUrl?gender=female", requiredPermissions)

        val json = JsonLoader.fromString(validator.getSplitText(response.text).json)
        val demographyJson = json["data"]["demographic_data"]

        val expectedDemographicMetadata = JsonLoader.fromString(json {
            obj(
                    "id" to "as-fert",
                    "name" to "as-fert descriptive name",
                    "age_interpretation" to "age of mother",
                    "source" to "unwpp2015",
                    "unit" to "Births per woman",
                    "gender" to "female",
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

            DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation()

            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, requiredPermissions, acceptsContentType = "text/csv")
        schema.validate(response.text)
    }

    @Test
    fun `returns demographic data csv with splitdata`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        var expectedRows = 0

        JooqContext().use {

            val data = DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
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
        val response = requestHelper.get("/touchstones/$touchstoneVersionId/demographics/unwpp2015/tot-pop/",
                requiredPermissions)

        val csv = validator.getSplitText(response.text).csv
        val CSVSchema = CSVSchema("DemographicData")
        val body = CSVSchema.validate(csv)

        Assertions.assertThat(body.count()).isEqualTo(expectedRows)
    }

    @Test
    fun `returns demographic data csv only`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        var expectedRows = 0

        JooqContext().use {

            val data = DemographicDummyData(it, touchstoneName, touchstoneVersion)
                    .withTouchstone()
                    .withPopulation(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)

            val numYears = 2
            val numAges = 2

            // should only ever be 2 variants - unwpp_estimates and unwpp_medium_variant
            val numVariants = 2

            val numCountries = data.countries.count()

            expectedRows = numAges * numYears * numCountries * numVariants
        }

        val schema = CSVSchema("DemographicData")
        val response = requestHelper.get("/touchstones/$touchstoneVersionId/demographics/unwpp2015/tot-pop/csv/",
                requiredPermissions)

        val body = schema.validate(response.text)
        Assertions.assertThat(body.count()).isEqualTo(expectedRows)
    }

    @Test
    fun `long demographic data for 2018 touchstone is rounded`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {

            val data = DemographicDummyData(it, "201810gavi", touchstoneVersion)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)
        }

        val schema = CSVSchema("DemographicData")
        val response = requestHelper.get("/touchstones/201810gavi-1/demographics/unwpp2015/as-fert/csv/",
                requiredPermissions)

        val body = schema.validate(response.text)
        assertLongDemographicValuesHaveDecimalPlaces(body, 2)
    }

    @Test
    fun `wide demographic data for 2018 touchstone is rounded`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {

            val data = DemographicDummyData(it, "201810gavi", touchstoneVersion)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)
        }

        val schema = CSVSchema("WideDemographicData")
        val response = requestHelper.get("/touchstones/201810gavi-1/demographics/unwpp2015/as-fert/csv/?format=wide",
                requiredPermissions)

        val body = schema.validate(response.text)
        assertWideDemographicValuesHaveDecimalPlaces(body, 2)
    }

    @Test
    fun `long demographic data for 2019 touchstone is not rounded`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {

            val data = DemographicDummyData(it, "201910gavi", touchstoneVersion)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)
        }

        val schema = CSVSchema("DemographicData")
        val response = requestHelper.get("/touchstones/201910gavi-1/demographics/unwpp2015/as-fert/csv/",
                requiredPermissions)

        val body = schema.validate(response.text)
        assertLongDemographicValuesHaveDecimalPlaces(body, 4)
    }

    @Test
    fun `wide demographic data for 2019 touchstone is not rounded`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {

            val data = DemographicDummyData(it, "201910gavi", touchstoneVersion)
                    .withTouchstone()
                    .withFertility(yearRange = 1950..1955 step 5, ageRange = 10..15 step 5)

            userHelper.setupTestUser(it)
        }

        val schema = CSVSchema("WideDemographicData")
        val response = requestHelper.get("/touchstones/201910gavi-1/demographics/unwpp2015/as-fert/csv/?format=wide",
                requiredPermissions)

        val body = schema.validate(response.text)
        assertWideDemographicValuesHaveDecimalPlaces(body, 4)
    }

    private fun assertLongDemographicValuesHaveDecimalPlaces(csvData: Iterable<Array<String>>, decimalPlaces: Int)
    {
        csvData.forEach {
            val demographicValue = it[7]
            val numParts = demographicValue.split(".")
            assertThat(numParts[1].count()).isEqualTo(decimalPlaces)
        }
    }

    private fun assertWideDemographicValuesHaveDecimalPlaces(csvData: Iterable<Array<String>>, decimalPlaces: Int)
    {
        csvData.forEach{
            for (i in 6..it.count()-1 )
            {
                val demographicValue = it[i]
                val numParts = demographicValue.split(".")
                assertThat(numParts[1].count()).isEqualTo(decimalPlaces)
            }
        }
    }

}