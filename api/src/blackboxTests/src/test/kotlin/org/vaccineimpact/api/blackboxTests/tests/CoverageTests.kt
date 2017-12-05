package org.vaccineimpact.api.blackboxTests.tests

import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.CoverageRow
import org.vaccineimpact.api.models.helpers.FlexibleColumns
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator
import java.io.StringReader
import java.math.BigDecimal

class CoverageTests : DatabaseTest()
{
    val groupId = "group-1"
    val touchstoneId = "touchstone-1"
    val scenarioId = "scenario-1"
    val coverageSetId = 1
    val groupScope = "modelling-group:$groupId"
    val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "$groupScope/responsibilities.read", "$groupScope/coverage.read")
    val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/coverage/"

    @Test
    fun `can get coverage data for responsibility`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedCoverageData")
        val test = validate(url) against (schema) given {
            addCoverageData(it, touchstoneStatus = "open")
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `can get wide coverage data for responsibility`()
    {
        val schema = SplitSchema(json = "ScenarioAndCoverageSets", csv = "MergedWideCoverageData")
        val test = validate("$url?format=wide") against (schema) given {
            addCoverageData(it, touchstoneStatus = "open")
        } requiringPermissions { minimumPermissions }
        test.run()
    }

    @Test
    fun `wide format coverage year columns are sorted`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        val testYear = 1980
        val testTarget = BigDecimal(123.123)
        val testCoverage = BigDecimal(456.456)

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open", testYear = testYear,
                    target = testTarget, coverage = testCoverage)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, contentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        val headers = csv.first().toList()
        val firstRow = csv.drop(1).first().toList()

        val expectedHeaders = listOf("scenario", "set_name", "vaccine", "gavi_support", "activity_type",
                "country_code", "country", "age_first", "age_last", "age_range_verbatim", "coverage_$testYear",
                "coverage_1985", "coverage_1990", "coverage_1995", "coverage_2000",
                "target_$testYear",
                "target_1985", "target_1990", "target_1995", "target_2000")

        headers.forEachIndexed { index, h ->
            Assertions.assertThat(h).isEqualTo(expectedHeaders[index])
        }

        Assertions.assertThat(BigDecimal(firstRow[10])).isEqualTo(testCoverage)
        Assertions.assertThat(BigDecimal(firstRow[15])).isEqualTo(testTarget)

    }

    @Test
    fun `wide format coverage rows are sorted`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            createGroupAndSupportingObjects(it)
            giveCoverageSetsAndDataToResponsibility(it)
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("$url?format=wide", minimumPermissions, contentType = "text/csv")
        val yearMap = mapOf("coverage_2000" to "<NA>",
                "coverage_2001" to "<NA>", "target_2000" to "<NA>", "target_2001" to "<NA>")

        val expected = listOf(
                TestWideCoverageRow(scenarioId, "First", "AF", "no gavi", "routine",
                        "AAA", "AAA-Name", 2.toDecimal(), 4.toDecimal(), "<NA>", yearMap),
                // first order by vaccine
                TestWideCoverageRow(scenarioId, "Second", "BF", "no gavi", "campaign",
                        "AAA", "AAA-Name", 1.toDecimal(), 2.toDecimal(), "<NA>", yearMap),
                // then by activity type
                TestWideCoverageRow(scenarioId, "Third", "BF", "no gavi", "routine",
                        "AAA", "AAA-Name", 1.toDecimal(), 2.toDecimal(), "<NA>", yearMap),
                // then by country
                TestWideCoverageRow(scenarioId, "Third", "BF", "no gavi", "routine",
                        "BBB", "BBB-Name", 1.toDecimal(), 2.toDecimal(), "<NA>", yearMap),
                // then by age first
                TestWideCoverageRow(scenarioId, "Third", "BF", "no gavi", "routine",
                        "BBB", "BBB-Name", 2.toDecimal(), 2.toDecimal(), "<NA>", yearMap),
                // then by age last
                TestWideCoverageRow(scenarioId, "Third", "BF", "no gavi", "routine",
                        "BBB", "BBB-Name", 2.toDecimal(), 4.toDecimal(), "<NA>", yearMap)
        )

        val rows = DataTableDeserializer.deserialize(response.text, TestWideCoverageRow::class)

        Assertions.assertThat(rows.toList()).containsExactlyElementsOf(expected)
    }

    @FlexibleColumns
    data class TestWideCoverageRow(
            val scenario: String, //This is the scenario description ID
            val setName: String,
            val vaccine: String,
            val gaviSupport: String,
            val activityType: String,
            val countryCode: String,
            val country: String,
            val ageFirst: BigDecimal?,
            val ageLast: BigDecimal?,
            val ageRangeVerbatim: String?,
            val coverageAndTargetPerYear: Map<String, String?>
    ) : CoverageRow

    @Test
    fun `can get pure CSV coverage data for responsibility`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, minimumPermissions, contentType = "text/csv")
        schema.validate(response.text)
    }

    @Test
    fun `can get pure CSV coverage data via one time link`()
    {
        validate("$url/get_onetime_link/") against "Token" given {
            addCoverageData(it, touchstoneStatus = "open")
        } requiringPermissions { minimumPermissions } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val schema = CSVSchema("MergedCoverageData")
            val requestHelper = RequestHelper()
            val response = requestHelper.get(oneTimeURL)
            schema.validate(response.text)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

    @Test
    fun `only touchstone preparer can get coverage data for in-preparation responsibility`()
    {
        val permission = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permission, SplitValidator())
        checker.checkPermissionIsRequired(permission,
                given = { addCoverageData(it, touchstoneStatus = "in-preparation") },
                expectedProblem = ExpectedProblem("unknown-touchstone", touchstoneId))
    }

    private fun addCoverageData(db: JooqContext, touchstoneStatus: String,
                                testYear: Int = 1955,
                                target: BigDecimal = BigDecimal(100.12),
                                coverage: BigDecimal = BigDecimal(200.13))
    {
        db.addGroup(groupId, "description")
        db.addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        db.addTouchstone("touchstone", 1, "description", touchstoneStatus, addName = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "submitted")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                addVaccine = true)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId, 0)
        db.generateCoverageData(coverageSetId, countryCount = 2, yearRange = 1985..2000 step 5,
                ageRange = 0..20 step 5, testYear = testYear, target = target, coverage = coverage)
    }

    private fun createGroupAndSupportingObjects(db: JooqContext)
    {
        db.addGroup(groupId, "description")
        db.addTouchstone("touchstone", 1, "description", "open", addName = true)
        db.addScenarioDescription(scenarioId, "Blue Fever Scenario", "BF", addDisease = true)
        db.addVaccine("BF", "Blue Fever")
        db.addVaccine("AF", "Alpha Fever")
    }


    private fun giveCoverageSetsAndDataToResponsibility(db: JooqContext)
    {
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "incomplete")
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "First", "AF", "without", "routine", id = 1)
        db.addCoverageSet(touchstoneId, "Second", "BF", "without", "campaign", id = 2)
        db.addCoverageSet(touchstoneId, "Third", "BF", "without", "routine", id = 3)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId = 1, order = 0)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId = 2, order = 1)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId = 3, order = 2)

        db.addCountries(listOf("AAA", "BBB", "CCC"))

        // adding these in jumbled up order
        db.addCoverageRow(1, "AAA", 2000, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(1, "AAA", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)

        db.addCoverageRow(2, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(2, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)

        db.addCoverageRow(3, "AAA", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(3, "AAA", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)

        db.addCoverageRow(3, "BBB", 2000, 2.toDecimal(), 4.toDecimal(), null, null, null)
        db.addCoverageRow(3, "BBB", 2001, 2.toDecimal(), 4.toDecimal(), null, null, null)

        db.addCoverageRow(3, "BBB", 2000, 2.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(3, "BBB", 2001, 2.toDecimal(), 2.toDecimal(), null, null, null)

        db.addCoverageRow(3, "BBB", 2001, 1.toDecimal(), 2.toDecimal(), null, null, null)
        db.addCoverageRow(3, "BBB", 2000, 1.toDecimal(), 2.toDecimal(), null, null, null)

    }
}