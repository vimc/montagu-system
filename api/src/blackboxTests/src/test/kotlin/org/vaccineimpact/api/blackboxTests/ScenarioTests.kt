package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JSON
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.PermissionChecker
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ScenarioTests : DatabaseTest()
{
    val requiredPermissions = setOf("can-login", "touchstones.read", "scenarios.read", "coverage.read")
    val touchstoneId = "touchstone-1"
    val setId = 1
    val scenarioId = 1

    @Test
    fun `can get scenarios (as they exist within a touchstone)`()
    {
        validate("/touchstones/$touchstoneId/scenarios/") against "ScenariosInTouchstone" given {
            addTouchstoneWithScenarios(it, touchstoneId, "open", scenarioId, setId)
        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(expectedObject())
            })
        }
    }

    @Test
    fun `only touchstone preparer can see scenarios for in-preparation touchstone`()
    {
        val permissionUnderTest = "touchstones.prepare"
        PermissionChecker(
                "/touchstones/$touchstoneId/scenarios/",
                requiredPermissions + permissionUnderTest
        ).checkPermissionIsRequired(permissionUnderTest, given = {
            addTouchstoneWithScenarios(it, touchstoneId, "in-preparation", scenarioId)
        })
    }

    @Test
    fun `can get scenario (as it exists within a touchstone)`()
    {
        validate("/touchstones/$touchstoneId/scenarios/$scenarioId") against "ScenariosInTouchstone" given {
            addTouchstoneWithScenarios(it, touchstoneId, "open", scenarioId, setId)
        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            assertThat(it).isEqualTo(json { expectedObject() })
        }
    }

    @Test
    fun `only touchstone-preparer can get scenario for in-preparation touchstone`()
    {
        val permissionUnderTest = "touchstones.prepare"
        PermissionChecker(
                "/touchstones/$touchstoneId/scenarios/$scenarioId",
                requiredPermissions + permissionUnderTest
        ).checkPermissionIsRequired(permissionUnderTest, given = {
            addTouchstoneWithScenarios(it, touchstoneId, "in-preparation", scenarioId)
        })
    }

    private fun addTouchstoneWithScenarios(
            it: JooqContext,
            touchstoneId: String,
            touchstoneStatus: String,
            scenarioId: Int,
            coverageSetId: Int = 1
    )
    {
        it.addTouchstone("touchstone", 1, status = touchstoneStatus, addStatus = true, addName = true)
        it.addScenarioDescription("scenario", "description", "disease", addDisease = true)
        it.addScenario(touchstoneId, "scenario", id = scenarioId)
        it.addCoverageSet(touchstoneId, "Set 1", "vaccine", "none", "routine",
                id = coverageSetId,
                addVaccine = true, addSupportLevel = true, addActivityType = true)
        it.addCoverageSetToScenario(scenarioId, coverageSetId, order = 0)
    }

    private fun JSON.expectedObject(): JsonObject
    {
        return obj(
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
    }
}