package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.Outcome
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

abstract class BurdenEstimateTests : DatabaseTest()
{
    protected val groupId = "group-1"
    protected val touchstoneVersionId = "touchstone-1"
    protected val scenarioId = "scenario-1"
    protected val groupScope = "modelling-group:$groupId"
    protected val urlBase = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId"
    protected val setUrl = "$urlBase/estimate-sets/"
    protected val requiredWritePermissions = PermissionSet(
            "$groupScope/estimates.write",
            "$groupScope/responsibilities.read"
    )
    protected val diseaseId = "Hib3"
    protected val diseaseName = "Hib3 Name"
    protected val username = "some.user"

    protected fun setUp(db: JooqContext): ReturnedIds
    {
        db.addTouchstoneVersion("touchstone", 1, "Touchstone 1", addTouchstone = true)
        db.addDisease(diseaseId, diseaseName)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = false)
        db.addGroup(groupId, "Test group")
        db.addModel("model-1", groupId, diseaseId)
        val modelVersionId = db.addModelVersion("model-1", "version-1", setCurrent = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneVersionId)
        val responsibilityId = db.addResponsibility(setId, touchstoneVersionId, scenarioId)
        return ReturnedIds(responsibilityId, modelVersionId, setId)
    }

    protected fun setUpWithBurdenEstimateSet(db: JooqContext,
                                             setId: Int? = null,
                                             status: String = "empty",
                                             expectedOutcomes: List<Outcome> = listOf(),
                                             setType: String = "central-single-run",
                                             yearMinInclusive: Short = 1996,
                                             yearMaxInclusive: Short = 1997): Int
    {
        val returnedIds = setUp(db)
        TestUserHelper.setupTestUser()

        db.addExpectations(returnedIds.responsibilityId,
                ageMaxInclusive = 50, ageMinInclusive = 50,
                yearMinInclusive = yearMinInclusive,
                yearMaxInclusive = yearMaxInclusive,
                countries = listOf("AFG", "AGO"), outcomes = expectedOutcomes)
        return db.addBurdenEstimateSet(
                returnedIds.responsibilityId,
                returnedIds.modelVersionId,
                TestUserHelper.username,
                status = status,
                setId = setId,
                setType = setType
        )
    }

    protected fun setUpWithStochasticBurdenEstimateSet(db: JooqContext): Int
    {
        val ids = setUp(db)
        val parameterSetId = db.addModelRunParameterSet(ids.responsibilitySetId, ids.modelVersionId,
                TestUserHelper.username)
        db.addModelRun(parameterSetId, "A")
        db.addModelRun(parameterSetId, "B")
        db.addExpectations(ids.responsibilityId, yearMinInclusive = 1996, yearMaxInclusive = 1997,
                ageMaxInclusive = 50, ageMinInclusive = 50, countries = listOf("AFG", "AGO"))
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
                TestUserHelper.username)
    }


    protected fun setupDatabaseWithModelRunParameterSetValues(db: JooqContext)
    {
        val returnedIds = setUp(db)

        val paramsSetId = db.addModelRunParameterSet(returnedIds.responsibilitySetId, returnedIds.modelVersionId, username)
        val modelRunId = db.addModelRun(paramsSetId, "1")
        val modelRunId2 = db.addModelRun(paramsSetId, "2")
        val modelRunParameterId1 = db.addModelRunParameter(paramsSetId, "<param_1>")
        val modelRunParameterId2 = db.addModelRunParameter(paramsSetId, "<param_2>")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId1, "aa")
        db.addModelRunParameterValue(modelRunId, modelRunParameterId2, "bb")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId1, "cc")
        db.addModelRunParameterValue(modelRunId2, modelRunParameterId2, "dd")
    }

    protected fun getPopulateOneTimeURL(setId: Int, redirect: Boolean = false, keepOpen: Boolean = true): String
    {
        var url = "$setUrl/$setId/?keepOpen=${keepOpen}"
        if (redirect)
        {
            url += "&redirectResultTo=http://localhost/"
        }
        val token = TestUserHelper.getToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))
        val oneTimeToken = RequestHelper().getOneTimeToken(url, token)
        return "$url&access_token=$oneTimeToken"
    }

    val partialCSVData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
"""

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""

    val longCsvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
   "Hib3",   1998,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1999,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1998,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1999,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""

    val duplicateCsvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1997,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
    val stochasticCSVData = """
"disease", "run_id", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",      "A",  1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",      "A",  1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",      "B",  1996,    50,     "AFG",  "Afghanistan",          5000,     1000,      NA,    5670
   "Hib3",      "B",  1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
    val duplicateStochasticCSVData = """
"disease", "run_id", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",      "A",  1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",      "A",  1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",      "A",  1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",      "B",  1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",      "B",  1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
    val badCSVData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",              ,         ,        ,
"""
    val wrongOutcomeCSVData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "bananas"
   "Hib3",   2000,     0,     "AFG",  "Afghanistan",             1,         2
"""

    data class ReturnedIds(val responsibilityId: Int, val modelVersionId: Int, val responsibilitySetId: Int)
}