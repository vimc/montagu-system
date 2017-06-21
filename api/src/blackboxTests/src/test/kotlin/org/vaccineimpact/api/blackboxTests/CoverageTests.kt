package org.vaccineimpact.api.blackboxTests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.blackboxTests.schemas.SplitSchema
import org.vaccineimpact.api.blackboxTests.validators.JSONValidator
import org.vaccineimpact.api.blackboxTests.validators.SplitValidator
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

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

            val badResponse =  requestHelper.get(oneTimeURL)
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

    @Test
    fun `coverage sets are indexed from one`()
    {
        val schema = CSVSchema("MergedCoverageData")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            addCoverageData(it, touchstoneStatus = "open")
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get(url, minimumPermissions, contentType = "text/csv")
        var csvRows = schema.validate(response.text)

        Assertions.assertThat(csvRows.first()[2]).isEqualTo("1")

    }

    private fun addCoverageData(db: JooqContext, touchstoneStatus: String)
    {
        db.addGroup(groupId, "description")
        db.addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        db.addTouchstone("touchstone", 1, "description", touchstoneStatus, 1900..2000, addName = true, addStatus = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "submitted", addStatus = true)
        db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addCoverageSet(touchstoneId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                addVaccine = true, addActivityType = true, addSupportLevel = true)
        db.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId, 0)
        db.generateCoverageData(coverageSetId, countryCount = 2, yearRange = 1995..2000, ageRange = 0..20 step 5)
    }
}