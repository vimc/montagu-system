package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.ExpectedProblem
import org.vaccineimpact.api.blackboxTests.helpers.PermissionChecker
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ResponsibilityTests : DatabaseTest()
{
    private val touchstoneId = "touchstone-1"
    private val groupId = "awesome-group"
    private val groupScope = "modelling-group:$groupId"
    private val scenarioId = "yf-scenario"
    private val modelId = "model-1"

    @Test
    fun `getResponsibilities matches schema`()
    {
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneId/") against "ResponsibilitySet" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            assertThat(it["touchstone"]).isEqualTo(touchstoneId)
            assertThat(it["status"]).isEqualTo("submitted")
            assertThat(it["problems"]).isEqualTo("")

            @Suppress("UNCHECKED_CAST")
            val responsibilities = it["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to
                                "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            assertThat(responsibility["status"]).isEqualTo("invalid")
            assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    @Test
    fun `not-applicable status is returned when there are no responsibilities`()
    {
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneId/") against "ResponsibilitySet" given {
            addUserGroupAndTouchstone(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone" to touchstoneId,
                        "status" to "not-applicable",
                        "problems" to "",
                        "responsibilities" to array()
                )
            })
        }
    }

    @Test
    fun `can get touchstones by group id`()
    {
        validate("/modelling-groups/$groupId/responsibilities/") against "Touchstones" given {
            it.addGroup(groupId)
            it.addTouchstoneName("touchstone", "description")
            it.addTouchstone("touchstone", 1, description = "descr 1", status = "open")
            it.addTouchstone("touchstone", 2)
            it.addResponsibilitySet(groupId, touchstoneId)
        } requiringPermissions {
            PermissionSet("*/touchstones.read", "$groupScope/responsibilities.read")
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(
                        obj(
                                "id" to touchstoneId,
                                "name" to "touchstone",
                                "version" to 1,
                                "description" to "descr 1",
                                "status" to "open"

                        )
                )
            })
        }
    }

    @Test
    fun `only touchstone preparer can see in-preparation responsibilities`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/"
        val minimumPermissions = PermissionSet("*/can-login", "$groupScope/responsibilities.read", "*/scenarios.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone", touchstoneId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    @Test
    fun `getResponsibility matches schema`()
    {
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/") against "ResponsibilityAndTouchstone" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            val touchstone = it["touchstone"] as JsonObject
            val responsibility = it["responsibility"] as JsonObject
            val scenario = responsibility["scenario"] as JsonObject
            assertThat(touchstone).isEqualTo(json {
                obj(
                        "id" to touchstoneId,
                        "name" to "touchstone",
                        "version" to 1,
                        "description" to "description",
                        "status" to "open"
                )
            })

            assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            assertThat(responsibility["status"]).isEqualTo("invalid")
            assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    @Test
    fun `only touchstone-preparer can see in-preparation responsibility`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/"
        val minimumPermissions = PermissionSet("*/can-login", "$groupScope/responsibilities.read", "*/scenarios.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone", touchstoneId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    @Test
    fun `get coverage sets matches schema`()
    {
        val coverageSetId = 1
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/coverage_sets/") against "ScenarioAndCoverageSets" given {
            addResponsibilities(it, touchstoneStatus = "open")
            it.addCoverageSet(touchstoneId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                    addVaccine = true)
            it.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId, 0)
        } requiringPermissions {
            PermissionSet("*/scenarios.read", "$groupScope/responsibilities.read", "$groupScope/coverage.read")
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone" to obj(
                                "id" to touchstoneId,
                                "name" to "touchstone",
                                "version" to 1,
                                "description" to "description",
                                "status" to "open"
                        ),
                        "scenario" to obj(
                                "id" to scenarioId,
                                "touchstones" to array(touchstoneId),
                                "description" to "description 1",
                                "disease" to "disease-1"
                        ),
                        "coverage_sets" to array(obj(
                                "id" to coverageSetId,
                                "touchstone" to touchstoneId,
                                "name" to "coverage set name",
                                "vaccine" to "vaccine-1",
                                "gavi_support" to "no gavi",
                                "activity_type" to "routine"
                        ))
                )
            })
        }
    }

    @Test
    fun `only touchstone preparer can see in-preparation coverage sets`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneId/$scenarioId/coverage_sets/"
        val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "$groupScope/responsibilities.read", "$groupScope/coverage.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone", touchstoneId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    private fun addUserGroupAndTouchstone(db: JooqContext, touchstoneStatus: String)
    {
        db.addUserForTesting("model.user")
        db.addGroup(groupId, "description")
        db.addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        db.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        db.addTouchstone("touchstone", 1, "description", touchstoneStatus, addName = true)
    }

    private fun addResponsibilities(db: JooqContext, touchstoneStatus: String)
    {
        addUserGroupAndTouchstone(db, touchstoneStatus)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "submitted")
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addResponsibility(setId, touchstoneId, "scenario-2")
        db.addModel(modelId, groupId, "disease-1")
        val version = db.addModelVersion(modelId, "version-1")
        val burdenEstimateId = db.addBurdenEstimateSet(responsibilityId, version, "model.user")
        db.updateCurrentEstimate(responsibilityId, burdenEstimateId)
        db.addBurdenEstimateProblem("problem", burdenEstimateId)
    }
}