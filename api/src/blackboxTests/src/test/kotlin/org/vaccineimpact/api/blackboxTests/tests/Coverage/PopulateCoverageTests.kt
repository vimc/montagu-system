package org.vaccineimpact.api.blackboxTests.tests.Coverage

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.db.direct.addVaccine
import org.vaccineimpact.api.db.tables.Country
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod
import java.io.File

class PopulateCoverageTests : CoverageTests()
{
    private val requiredPermissions = PermissionSet("*/coverage.write")

    @Test
    fun `can get coverage validation message for invalid countries`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                badCountryCsvData,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateError(response.text, "bad-request", "Unrecognised or unexpected country: nonsense")
    }

    @Test
    fun `can get coverage validation message for invalid vaccines`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                badVaccineCsvData,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateError(response.text, "foreign-key-error", "Unrecognised vaccine: nonsense")
    }

    @Test
    fun `can get coverage validation message for missing rows`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                missingRowsCsvData,
                token = token,
                data = mapOf("description" to "test description"))
        val expectedRowNum = 73 * 10 // countries * years
        val providedRowNum = 2
        JSONValidator().validateError(response.text, "missing-rows",
                "Missing ${expectedRowNum - providedRowNum} rows for vaccines HepB_BD")
    }

    @Test
    fun `can get coverage validation message for duplicate rows`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                duplicateRowsCsvData,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateError(response.text, "bad-request",
                "Duplicate row detected: 2021, HepB_BD, AFG")
    }

    @Test
    fun `can get coverage validation message for unexpected year`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                unexpectedYearCsvData,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateError(response.text, "bad-request",
                "Unexpected year: 2031")
    }

    @Test
    fun `can populate coverage from multipart file request`()
    {
        // this data is somewhat realistically sized - in practice will likely be fewer vaccines
        val data = File("coverage.csv").readText()
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                data,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateSuccess(response.text)
        verifyCorrectRows()
    }

    @Test
    fun `populating coverage requires coverage write permission`()
    {
        setup()
        val token = TestUserHelper.setupTestUserAndGetToken(setOf(), includeCanLogin = true)
        val response = RequestHelper().postFile("/touchstones/$touchstoneVersionId/coverage/",
                csvData,
                token = token,
                data = mapOf("description" to "test description"))
        JSONValidator().validateError(response.text, "forbidden")
    }

    private fun setup()
    {
        JooqContext().use { db ->

            db.addTouchstoneVersion("touchstone", 1, "description", "open", addTouchstone = true)
            listOf("HepB_BD", "HepB", "Hib3", "HPV", "JE", "MCV1", "MCV2",
                    "Measles", "MenA", "PCV3", "Rota", "Rubella", "YF",
                    "DTP3", "RCV2", "HepB_BD_home", "Cholera", "Typhoid")
                    .forEach {
                        db.addVaccine(it)
                    }
            db.dsl.newRecord(Tables.FRANCOPHONE_STATUS)
                    .apply {
                        id = "fff"
                    }.store()
            db.dsl.newRecord(Tables.VXDEL_SEGMENT)
                    .apply {
                        id = "v1"
                    }.store()

            db.dsl.newRecord(Tables.GAVI_REGION)
                    .apply {
                        id = "g1"
                        name = "gaviregion"
                    }.store()

            // using real GAVI73 country ids to match the realistic data in coverage.csv
            val countryIds = listOf("AFG", "AGO", "ARM", "AZE", "BDI", "BEN", "BFA", "BGD", "BOL", "BTN", "CAF", "CIV",
                    "CMR", "COD", "COG", "COM", "CUB", "DJI", "ERI", "ETH", "GEO", "GHA", "GIN", "GMB", "GNB", "GUY",
                    "HND", "HTI", "IDN", "IND", "KEN", "KGZ", "KHM", "KIR", "LAO", "LBR", "LKA", "LSO", "MDA", "MDG",
                    "MLI", "MMR", "MNG", "MOZ", "MRT", "MWI", "NER", "NGA", "NIC", "NPL", "PAK", "PNG", "PRK", "RWA",
                    "SDN", "SEN", "SLB", "SLE", "SOM", "SSD", "STP", "TCD", "TGO", "TJK", "TLS", "TZA", "UGA", "UKR",
                    "UZB", "VNM", "YEM", "ZMB", "ZWE")
            val countryRecords = db.dsl.select(Country.COUNTRY.ID)
                    .from(Country.COUNTRY)
                    .where(COUNTRY.ID.`in`(countryIds))
                    .fetchInto(String::class.java)
                    .map {
                        db.dsl.newRecord(COUNTRY_METADATA).apply {
                            this.country = it
                            this.gavi73 = true
                            this.touchstone = "touchstone-1"
                            this.whoRegion = "123"
                            this.continent = "aaa"
                            this.region = "bbb"
                            this.francophone = "fff"
                            this.vxdelSegment = "v1"
                            this.gaviRegion = "g1"
                            this.wuenicCoverage = false
                            this.pine_5 = false
                            this.dove94 = false
                            this.dove96 = false
                            this.gavi68 = false
                            this.gavi72 = false
                            this.gavi77 = false
                        }
                    }
            db.dsl.batchStore(countryRecords).execute()
        }
    }

    private fun verifyCorrectRows()
    {
        JooqContext().use {
            val expectedNumberOfSets = 18 * 2 // vaccines, activities
            val coverageSets = it.dsl.selectFrom(COVERAGE_SET).fetch()
            assertThat(coverageSets.count()).isEqualTo(expectedNumberOfSets)

            val coverage = it.dsl.selectFrom(COVERAGE).fetch()
            val expectedNumberOfRows = expectedNumberOfSets * 10 * 73 // sets, years, countries
            assertThat(coverage.count()).isEqualTo(expectedNumberOfRows)

            val metadata = it.dsl.selectFrom(COVERAGE_SET_UPLOAD_METADATA).fetch()
            assertThat(metadata.count()).isEqualTo(1)
            assertThat(metadata.first()[COVERAGE_SET_UPLOAD_METADATA.UPLOADED_BY]).isEqualTo("test.user")
            assertThat(metadata.first()[COVERAGE_SET_UPLOAD_METADATA.DESCRIPTION]).isEqualTo("test description")
        }
    }

    private val csvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "true",  "2021",         1,     10,    "female", 100, 78.8
   "HepB_BD",   "AFG",    "campaign",     "true",  "2022",         1,      10,    "female", 100, 65.5
"""

    private val badCountryCsvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "true",  "2021",         1,     10,    "female", 100, 78.8
   "HepB_BD",   "nonsense",    "campaign",     "true",  "2022",         1,      10,    "female", 100, 65.5
"""

    private val badVaccineCsvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "campaign",     "true",  "2021",         1,     10,    "female", 100, 78.8
   "nonsense",   "AFG",    "campaign",     "true",  "2022",         1,      10,    "female", 100, 65.5
"""

    private val missingRowsCsvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "routine",     "true",  "2021",         1,     10,    "female", 100, 78.8
   "HepB_BD",   "AFG",    "routine",     "true",  "2022",         1,      10,    "female", 100, 65.5
"""

    private val duplicateRowsCsvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "routine",     "true",  "2021",         1,     10,    "female", 100, 78.8
   "HepB_BD",   "AFG",    "routine",     "true",  "2021",         1,      10,    "female", 100, 65.5
"""

    private val unexpectedYearCsvData = """
"vaccine", "country", "activity_type", "gavi_support", "year", "age_first", "age_last", "gender", "target", "coverage"
   "HepB_BD",   "AFG",    "routine",     "true",  "2031",         1,     10,    "female", 100, 78.8
"""
}
