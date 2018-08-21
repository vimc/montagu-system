package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.KlaxonJson
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
    val requiredPermissions = PermissionSet("*/can-login", "*/touchstones.read", "*/scenarios.read")
    val touchstoneVersionId = "touchstone-1"
    val setId = 1
    val scenarioId = "scenario"

    @Test
    fun `can get scenarios (as they exist within a touchstone)`()
    {
        validate("/touchstones/$touchstoneVersionId/scenarios/") against "ScenariosInTouchstone" given {
            addTouchstoneWithScenarios(it, touchstoneVersionId, "open", coverageSetId = setId)
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
                "/touchstones/$touchstoneVersionId/scenarios/",
                requiredPermissions + permissionUnderTest
        ).checkPermissionIsRequired(permissionUnderTest, given = {
            addTouchstoneWithScenarios(it, touchstoneVersionId, "in-preparation")
        })
    }

    @Test
    fun `can get scenario (as it exists within a touchstone)`()
    {
        validate("/touchstones/$touchstoneVersionId/scenarios/$scenarioId") against "ScenarioAndCoverageSets" given {
            addTouchstoneWithScenarios(it, touchstoneVersionId, "open", coverageSetId = setId)
        } requiringPermissions {
            requiredPermissions
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone_version" to obj(
                                "id" to touchstoneVersionId,
                                "name" to "touchstone",
                                "version" to 1,
                                "description" to "Description",
                                "status" to "open"
                        ),
                        "scenario" to expectedScenario(),
                        "coverage_sets" to expectedCoverageSets()
                )
            })
        }
    }

    private fun addTouchstoneWithScenarios(
            it: JooqContext,
            touchstoneVersionId: String,
            touchstoneStatus: String,
            scenarioId: Int = 1,
            coverageSetId: Int = 1
    )
    {
        it.addTouchstoneVersion("touchstone", 1, status = touchstoneStatus, addTouchstone = true)
        it.addScenarioDescription("scenario", "description", "disease", addDisease = true)
        it.addScenarioToTouchstone(touchstoneVersionId, "scenario", id = scenarioId)
        it.addCoverageSet(touchstoneVersionId, "Set 1", "vaccine", "none", "routine",
                id = coverageSetId,
                addVaccine = true)
        it.addCoverageSetToScenario(scenarioId, coverageSetId, order = 0)
    }

    private fun KlaxonJson.expectedScenario(): JsonObject
    {
        return obj(
                "id" to "scenario",
                "description" to "description",
                "touchstones" to array("touchstone-1"),
                "disease" to "disease"
        )
    }

    private fun KlaxonJson.expectedCoverageSets(): JsonArray<Any?>
    {
        return array(obj(
                "id" to setId,
                "touchstone_version" to "touchstone-1",
                "name" to "Set 1",
                "vaccine" to "vaccine",
                "gavi_support" to "no vaccine",
                "activity_type" to "routine"
        ))
    }
}