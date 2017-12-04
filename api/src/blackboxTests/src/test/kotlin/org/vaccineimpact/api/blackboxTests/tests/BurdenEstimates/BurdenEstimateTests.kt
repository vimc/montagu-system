package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator


abstract class BurdenEstimateTests : DatabaseTest()
{
    protected val groupId = "group-1"
    protected val touchstoneId = "touchstone-1"
    protected val scenarioId = "scenario-1"
    protected val groupScope = "modelling-group:$groupId"
    protected val urlBase = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId"
    protected val url = "$urlBase/estimates/"
    protected val setUrl = "$urlBase/estimate-sets/"
    protected val requiredWritePermissions = PermissionSet(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )
    protected val disease = "Hib3"

    protected fun setUp(db: JooqContext): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        db.addModel("model-1", groupId, disease)
        val modelVersionId = db.addModelVersion("model-1", "version-1", setCurrent = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        return ReturnedIds(responsibilityId, modelVersionId, setId)
    }

    protected fun setUpWithBurdenEstimateSet(db: JooqContext): Int
    {
        val returnedIds = setUp(db)
        return db.addBurdenEstimateSet(returnedIds.responsibilityId, returnedIds.modelVersionId, TestUserHelper.username)
    }

    protected fun setUpWithModelRunParameterSet(db: JooqContext): Int
    {
        val returnedIds = setUp(db)
        return db.addModelRunParameterSet(returnedIds.responsibilitySetId, returnedIds.modelVersionId,
                TestUserHelper.username, "description")
    }

    protected fun validateOneTimeLinkWithRedirect(url: String){

        validate("$url/get_onetime_link/?redirectUrl=http://localhost/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
            JSONValidator().validateSuccess(resultAsString)
        }
    }

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
    val badCSVData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",              ,         ,        ,
"""

    data class ReturnedIds(val responsibilityId: Int, val modelVersionId: Int, val responsibilitySetId: Int)
}