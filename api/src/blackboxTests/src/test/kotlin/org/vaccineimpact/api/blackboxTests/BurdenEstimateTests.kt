package org.vaccineimpact.api.blackboxTests

import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class BurdenEstimateTests : DatabaseTest()
{
    val groupId = "group-1"
    val touchstoneId = "touchstone-1"
    val scenarioId = "scenario-1"
    val groupScope = "modelling-group:$groupId"
    val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/estimates/"

    @Test
    fun `can upload burden estimate`()
    {
        validate(url, method = HttpMethod.post) sending {
            csvData
        } given { db ->
            db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
            db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
            db.addGroup(groupId, "Test group")
            val setId = db.addResponsibilitySet(groupId, touchstoneId)
            db.addResponsibility(setId, touchstoneId, scenarioId)
        } withRequestSchema {
            CSVSchema("BurdenEstimate")
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.write",
                    "$groupScope/responsibilities.read"
            )
        } andCheckObjectCreation "$url/1"
    }

    val csvData = """
"disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
   "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
   "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
   "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
   "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
"""
}