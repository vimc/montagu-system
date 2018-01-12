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
    protected val diseaseId = "Hib3"
    protected val diseaseName = "Hib3 Name"
    protected val modelId = "model-1"
    protected val modelVersion = "version-1"
    protected val username = "some.user"

    protected fun setUp(db: JooqContext): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addDisease(diseaseId, diseaseName)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = false)
        db.addGroup(groupId, "Test group")
        db.addModel("model-1", groupId, diseaseId)
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

    protected fun setUpWithStochasticBurdenEstimateSet(db: JooqContext): Int
    {
        val ids = setUp(db)
        val parameterSetId = db.addModelRunParameterSet(ids.responsibilitySetId, ids.modelVersionId,
                TestUserHelper.username, "description")
        db.addModelRun(parameterSetId, "A")
        db.addModelRun(parameterSetId, "B")
        return db.addBurdenEstimateSet(ids.responsibilityId, ids.modelVersionId,
                TestUserHelper.username,
                setType = "stochastic",
                modelRunParameterSetId = parameterSetId
        )
    }

    protected fun setUpWithModelRunParameterSet(db: JooqContext): Int
    {
        val returnedIds = setUp(db)
        return db.addModelRunParameterSet(returnedIds.responsibilitySetId, returnedIds.modelVersionId,
                TestUserHelper.username, "description")
    }


    protected fun setupDatabaseWithModelRunParameterSetValues(db: JooqContext)
    {
        val returnedIds = setUp(db)

        val paramsSetId = db.addModelRunParameterSet(returnedIds.responsibilitySetId, returnedIds.modelVersionId, username, "test params")
        val modelRunId = db.addModelRun(paramsSetId, "1")
        val modelRunId2 = db.addModelRun(paramsSetId, "2")
        val modelRunParameterId1 = db.addModelRunParameter(paramsSetId, "<param_1>")
        val modelRunParameterId2 = db.addModelRunParameter(paramsSetId, "<param_2>")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId1, "aa")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId2, "bb")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId1, "cc")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId2, "dd")
    }



    protected fun validateOneTimeLinkWithRedirect(url: String)
    {

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
    val stochasticCSVData = """
"disease", "run_id", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",      "A",  1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",      "A",  1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",      "B",  1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",      "B",  1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
    val badCSVData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",              ,         ,        ,
"""

    data class ReturnedIds(val responsibilityId: Int, val modelVersionId: Int, val responsibilitySetId: Int)
}