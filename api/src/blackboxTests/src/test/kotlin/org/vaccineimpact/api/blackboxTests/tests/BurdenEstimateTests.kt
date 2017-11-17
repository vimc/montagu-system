package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
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
    private val setUrl = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/estimate-sets/"
    private val requiredPermissions = PermissionSet(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )

    @Test
    fun `can get burden estimate sets`()
    {
        validate(setUrl) against "BurdenEstimates" given { db ->
            val ids = setUp(db)
            db.addUserForTesting("some.user")
            val setId = db.addBurdenEstimateSet(ids.responsibilityId, ids.modelVersionId, "some.user")
            db.addBurdenEstimateProblem("a problem", setId)
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.read",
                    "$groupScope/responsibilities.read"
            )
        } andCheckArray { data ->
            val obj = data.first() as JsonObject
            assertThat(obj["uploaded_by"]).isEqualTo("some.user")
            assertThat(obj["problems"]).isEqualTo(json {
                array("a problem")
            })
        }
    }

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
            setId = setUpWithBurdenEstimateSet(it)
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
            Assertions.assertThat(response.statusCode).isEqualTo(201)

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

    private fun setUp(db: JooqContext): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        db.addModel("model-1", groupId, "Hib3")
        val modelVersionId = db.addModelVersion("model-1", "version-1", setCurrent = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        return ReturnedIds(responsibilityId, modelVersionId)
    }

    private fun setUpWithBurdenEstimateSet(db: JooqContext): Int
    {
        val returnedIds = setUp(db)
        return db.addBurdenEstimateSet(returnedIds.responsibilityId, returnedIds.modelVersionId, TestUserHelper.username)
    }

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
}

data class ReturnedIds(val responsibilityId: Int, val modelVersionId: Int)
