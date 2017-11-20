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
import org.vaccineimpact.api.db.nextDecimal
import org.vaccineimpact.api.models.permissions.PermissionSet
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

        val expectedHeaders = listOf("scenario", "set_name","vaccine","gavi_support","activity_type",
                "country_code", "country", "age_first", "age_last","age_range_verbatim", "coverage_$testYear",
                "coverage_1985", "coverage_1990", "coverage_1995", "coverage_2000",
                "target_$testYear",
                "target_1985", "target_1990", "target_1995", "target_2000")

        headers.forEachIndexed{ index, h ->
            Assertions.assertThat(h).isEqualTo(expectedHeaders[index])
        }

        Assertions.assertThat(BigDecimal(firstRow[10])).isEqualTo(testCoverage)
        Assertions.assertThat(BigDecimal(firstRow[15])).isEqualTo(testTarget)

    }

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
}