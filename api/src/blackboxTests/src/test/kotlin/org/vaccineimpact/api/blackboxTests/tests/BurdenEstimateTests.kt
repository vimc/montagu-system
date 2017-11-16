package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.LocationConstraint
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
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
    val requiredPermissions = PermissionSet(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )

    @Test
    fun `can get burden estimate sets`()
    {
        validate(url) against "BurdenEstimates" given { db ->
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

data class ReturnedIds(val responsibilityId: Int, val modelVersionId: Int)
