package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JSON
import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.PermissionChecker
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ScenarioTests : DatabaseTest()
{
    val requiredPermissions = PermissionSet("*/can-login", "*/touchstones.read", "*/scenarios.read", "*/coverage.read")
    val touchstoneId = "touchstone-1"
    val setId = 1
    val scenarioId = "scenario"

    @Test
    fun `can get scenarios (as they exist within a touchstone)`()
    {
        validate("/touchstones/$touchstoneId/scenarios/") against "ScenariosInTouchstone" given {
            addTouchstoneWithScenarios(it, touchstoneId, "open", coverageSetId = setId)
        } requiringPermissions {
            requiredPermissions
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(obj(
                        "scenario" to expectedScenario(),
                        "coverage_sets" to expectedCoverageSets()
                ))
            })
        }
    }

    @Test
    fun `only touchstone preparer can see scenarios for in-preparation touchstone`()
    {
        val permissionUnderTest = "*/touchstones.prepare"
        PermissionChecker(
                "/touchstones/$touchstoneId/scenarios/",
                requiredPermissions + permissionUnderTest
        ).checkPermissionIsRequired(permissionUnderTest, given = {
            addTouchstoneWithScenarios(it, touchstoneId, "in-preparation")
        })
    }

    @Test
    fun `can get scenario (as it exists within a touchstone)`()
    {
        validate("/touchstones/$touchstoneId/scenarios/$scenarioId") against "ScenarioAndCoverageSets" given {
            addTouchstoneWithScenarios(it, touchstoneId, "open", coverageSetId = setId)
        } requiringPermissions {
            requiredPermissions
        } andCheck {
            assertThat(it).isEqualTo(json { obj(
                    "touchstone" to obj(
                            "id" to touchstoneId,
                            "name" to "touchstone",
                            "version" to 1,
                            "description" to "Description",
                            "status" to "open"
                    ),
                    "scenario" to expectedScenario(),
                    "coverage_sets" to expectedCoverageSets()
            ) })
        }
    }

    @Test
    fun `only touchstone-preparer can get scenario for in-preparation touchstone`()
    {
        val permissionUnderTest = "*/touchstones.prepare"
        PermissionChecker(
                "/touchstones/$touchstoneId/scenarios/$scenarioId",
                requiredPermissions + permissionUnderTest
        ).checkPermissionIsRequired(permissionUnderTest, given = {
            addTouchstoneWithScenarios(it, touchstoneId, "in-preparation")
        })
    }

    private fun addTouchstoneWithScenarios(
            it: JooqContext,
            touchstoneId: String,
            touchstoneStatus: String,
            scenarioId: Int = 1,
            coverageSetId: Int = 1
    )
    {
        it.addTouchstone("touchstone", 1, status = touchstoneStatus, addName = true)
        it.addScenarioDescription("scenario", "description", "disease", addDisease = true)
        it.addScenarioToTouchstone(touchstoneId, "scenario", id = scenarioId)
        it.addCoverageSet(touchstoneId, "Set 1", "vaccine", "none", "routine",
                id = coverageSetId,
                addVaccine = true)
        it.addCoverageSetToScenario(scenarioId, coverageSetId, order = 0)
    }

    private fun JSON.expectedScenario(): JsonObject
    {
        return obj(
                "id" to "scenario",
                "description" to "description",
                "touchstones" to array("touchstone-1"),
                "disease" to "disease"
        )
    }

    private fun JSON.expectedCoverageSets(): JsonArray<Any?>
    {
        return array(obj(
                "id" to setId,
                "touchstone" to "touchstone-1",
                "name" to "Set 1",
                "vaccine" to "vaccine",
                "gavi_support" to "no vaccine",
                "activity_type" to "routine"
        ))
    }
}