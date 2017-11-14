package org.vaccineimpact.api.blackboxTests.tests

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.LocationContraint
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod
import java.io.File


class BurdenEstimateTests : DatabaseTest()
{
    val groupId = "group-1"
    val touchstoneId = "touchstone-1"
    val scenarioId = "scenario-1"
    val groupScope = "modelling-group:$groupId"
    val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/estimates/"
    val setUrl = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/estimate-set/"
    val requiredPermissions = PermissionSet(
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
        Assertions.assertThat(response.statusCode).isEqualTo(201)
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
        } andCheckObjectCreation LocationContraint(url, unknownId = true)
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

            val file = File("file")
            file.printWriter().use { out ->
                out.write(csvData)
            }

            val response = requestHelper.postFile(oneTimeURL, file)

            file.delete()
            assert(response.statusCode == 201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
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
    fun `can upload burden estimate via onetime link and redirect`()
    {
        validate("$url/get_onetime_link/?redirectUrl=https://support.montagu.dide.ic.ac.uk:10443/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredPermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val file = File("file")
            file.printWriter().use { out ->
                out.write(csvData)
            }

            val response = requestHelper.postFile(oneTimeURL, file)
            val url = response.url
            val encodedResult = url.substring(44)

            Assertions.assertThat(url).contains("https://support.montagu.dide.ic.ac.uk:10443/?result=")
            Assertions.assertThat(encodedResult).isNotEmpty()

            file.delete()
        }
    }

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
}