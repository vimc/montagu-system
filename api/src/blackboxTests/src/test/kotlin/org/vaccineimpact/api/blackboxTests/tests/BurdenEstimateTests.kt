package org.vaccineimpact.api.blackboxTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod


class BurdenEstimateTests : DatabaseTest()
{
    private val groupId = "group-1"
    private val touchstoneId = "touchstone-1"
    private val scenarioId = "scenario-1"
    private val groupScope = "modelling-group:$groupId"
    private val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/estimates/"
    private val requiredPermissions = PermissionSet(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )

    @Test
    fun `can create burden estimate`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions.plus(PermissionSet("*/can-login")))

        JooqContext().use {
            setUp(it)
        }

        val response = requestHelper.post(setUrl, token = token, data = csvData)
        Assertions.assertThat(response.statusCode).isEqualTo(201)
    }


    @Test
    fun `can populate burden estimate`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions.plus(PermissionSet("*/can-login")))

        var setId = 0
        JooqContext().use {
            setId = setUpWithSet(it)
        }

        val response = requestHelper.post("$setUrl/$setId", token = token, data = csvData)
        Assertions.assertThat(response.statusCode).isEqualTo(200)
    }


    @Test
    fun `can upload burden estimate`()
    {
        validate(url, method = HttpMethod.post) sending {
            csvData
        } given { db ->
            setUp(db)
        } withRequestSchema {
            CSVSchema("BurdenEstimate")
        } requiringPermissions {
            requiredPermissions
        } andCheckObjectCreation LocationConstraint(url, unknownId = true)
            requiredPermissions
        } andCheckObjectCreation LocationContraint(url, unknownId = true)
    }

    @Test
    fun `bad CSV data results in ValidationError`()
    {
        JooqContext().use { setUp(it) }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredPermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val response = helper.post(url, "bad_header,year,age,country,country_name,cohort_size", token = token)
        JSONValidator().validateError(response.text, "csv-unexpected-header")
    }

    @Test
    fun `can upload burden estimate via onetime link`()
    {
        validate("$url/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredPermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            assertThat(response.statusCode).isEqualTo(201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

    @Test
    fun `can upload burden estimate via onetime link and redirect`()
    {
        validate("$url/get_onetime_link/?redirectUrl=http://localhost") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredPermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
            JSONValidator().validateSuccess(resultAsString)
        }
    }

    private fun setUpWithSet(db: JooqContext): Int
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        val versionId = db.addModel("model-1", groupId, "Hib3", versions = listOf("version-1"))
        val setId = db.addResponsibilitySet(groupId, touchstoneId)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        return db.addBurdenEstimateSet(responsibilityId, versionId, TestUserHelper.username)
    }

    @Test
    fun `bad CSV data results in ValidationError in redirect`()
    {
        validate("$url/get_onetime_link/?redirectUrl=http://localhost") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredPermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, "bad_header,year,age,country,country_name,cohort_size")
            val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
            JSONValidator().validateError(resultAsString, expectedErrorCode = "csv-unexpected-header")
        }
    }

    private fun setUp(db: JooqContext)
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        db.addModel("model-1", groupId, "Hib3", versions = listOf("version-1"))
        val setId = db.addResponsibilitySet(groupId, touchstoneId)
        db.addResponsibility(setId, touchstoneId, scenarioId)
    }

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
}