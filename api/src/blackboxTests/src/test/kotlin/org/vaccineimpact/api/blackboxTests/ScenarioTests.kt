package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ScenarioTests : DatabaseTest()
{
    val requiredPermissions = setOf("can-login", "touchstones.read", "scenarios.read", "coverage.read")
    val touchstoneId = "touchstone-1"
    val url = "/touchstones/$touchstoneId/scenarios/"

    @Test
    fun `can get scenarios as they exist within a touchstone`()
    {
        var setId: Int = -1
        validate(url) against "ScenariosInTouchstone" given {
            setId = addTouchstoneWithScenarios(it, touchstoneId, "open")
        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            assertThat(it).isEqualTo(json { array(
                obj(
                        "scenario" to obj(
                                "id" to "scenario",
                                "description" to "description",
                                "touchstones" to array("touchstone-1"),
                                "disease" to "disease"
                        ),
                        "coverage_sets" to array(obj(
                                "id" to setId,
                                "touchstone" to "touchstone-1",
                                "name" to "Set 1",
                                "vaccine" to "vaccine",
                                "gavi_support_level" to "none",
                                "activity_type" to "routine"
                        ))
                )
            )})
        }
    }

    @Test
    fun `only touchstone preparer can see scenarios for in-preparation touchstone`()
    {
        val touchstoneId = "touchstone-1"
        val requests = RequestHelper()
        JooqContext().use {
            addTouchstoneWithScenarios(it, touchstoneId, "in-preparation")
            TestUserHelper().setupTestUser(it)
            it.createPermissions(requiredPermissions + "touchstones.prepare")
        }
        val badData = requests.get(url, requiredPermissions).json()
        assertThat(badData["status"]).isEqualTo("failure")
        val error = (badData["errors"] as JsonArray<JsonObject>).first()
        assertThat(error["code"]).isEqualTo("forbidden")
        assertThat(error["message"] as String).contains("touchstones.prepare")

        val data = requests.get(url, requiredPermissions + "touchstones.prepare").montaguDataAsArray()
        assertThat(data).hasSize(1)
    }

    private fun addTouchstoneWithScenarios(it: JooqContext, touchstoneId: String, touchstoneStatus: String): Int
    {
        it.addTouchstone("touchstone", 1, status = touchstoneStatus, addStatus = true, addName = true)
        it.addScenarioDescription("scenario", "description", "disease", addDisease = true)
        val scenarioId = it.addScenario(touchstoneId, "scenario")
        val setId = it.addCoverageSet(touchstoneId, "Set 1", "vaccine", "none", "routine",
                addVaccine = true, addSupportLevel = true, addActivityType = true)
        it.addCoverageSetToScenario(scenarioId, setId, order = 0)
        return setId
    }
}