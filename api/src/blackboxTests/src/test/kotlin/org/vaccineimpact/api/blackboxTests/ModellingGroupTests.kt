package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.SchemaValidator
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ModellingGroupTests : DatabaseTest()
{
    val touchstoneId = "touchstone-1"

    @Test
    fun `getModellingGroups matches schema`()
    {
        validate("/modelling-groups/") against "ModellingGroups" given {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        } requiringPermissions {
            setOf("modelling-groups.read")
        } andCheckArray {
            assertThat(it).isEqualTo(json { array(
                    obj("id" to "a", "description" to "description a"),
                    obj("id" to "b", "description" to "description b")
            )})
        }
    }

    @Test
    fun `getResponsibilities matches schema`()
    {
        val group = "groupId"
        validate("/modelling-groups/$group/responsibilities/$touchstoneId/") against "ResponsibilitySet" given {
            addResponsibilities(it, group, touchstoneStatus = "open")
        } requiringPermissions {
            setOf("responsibilities.read", "scenarios.read")
        } andCheck {
            assertThat(it["touchstone"]).isEqualTo(touchstoneId)
            assertThat(it["status"]).isEqualTo("submitted")
            assertThat(it["problems"]).isEqualTo("")

            val responsibilities = it["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            assertThat(scenario).isEqualTo(json { obj(
                    "id" to "scenario-1",
                    "description" to
                    "description 1",
                    "disease" to "disease-1",
                    "touchstones" to array("touchstone-1")
            )})
            assertThat(responsibility["status"]).isEqualTo("empty")
            assertThat(responsibility["problems"]).isEqualTo(json { array() })
            assertThat(responsibility["current_estimate"]).isEqualTo(null)
        }
    }

    @Test
    fun `can get responsibilities with modelling group scoped permissions`()
    {
        // We should check that only the correct modelling group can do so
        TODO()
    }

    @Test
    fun `only touchstone preparer can see in-preparation responsibilities`()
    {
        val group = "groupId"
        val minimumPermissions = setOf("can-login", "responsibilities.read", "scenarios.read")
        val extraPermissions = setOf("touchstones.prepare")
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()
        val validator = SchemaValidator()
        val url = "/modelling-groups/$group/responsibilities/$touchstoneId/"

        JooqContext().use {
            addResponsibilities(it, group, touchstoneStatus = "in-preparation")
            userHelper.setupTestUser(it)
            it.createPermissions(minimumPermissions + extraPermissions)
        }

        val badResponse = requestHelper.get(url, minimumPermissions)
        validator.validateError(badResponse.text,
                expectedErrorCode = "unknown-touchstone",
                assertionText = "Expected to get an error without touchstones.preparer permission")

        val response = requestHelper.get(url, minimumPermissions + extraPermissions)
        validator.validateSuccess(response.text)
    }

    @Test
    fun `get coverage sets matches schema`()
    {
        val group = "groupId"
        val scenarioId = "scenario-1"
        val coverageSetId = 1
        validate("/modelling-groups/$group/responsibilities/$touchstoneId/coverage_sets/$scenarioId") against "ScenarioAndCoverageSets" given {
            addResponsibilities(it, group, touchstoneStatus = "open")
            it.addCoverageSet(touchstoneId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                    addVaccine = true, addActivityType = true, addSupportLevel = true)
            it.addCoverageSetToScenario(scenarioId, touchstoneId, coverageSetId, 0)
        } requiringPermissions {
            setOf("scenarios.read", "responsibilities.read", "coverage.read")
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone" to obj(
                                "id" to touchstoneId,
                                "name" to "touchstone",
                                "version" to 1,
                                "description" to "description",
                                "years" to obj("start" to 1900, "end" to 2000),
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
                                "gavi_support_level" to "without",
                                "activity_type" to "routine"
                        ))
                )
            })
        }
    }

    @Test
    fun `can get coverage sets with modelling group scoped permissions`()
    {
        // We should check that only the correct modelling group can do so
        TODO()
    }

    @Test
    fun `only touchstone preparer can see in-preparation coverage sets`()
    {
        TODO()
    }


    private fun addResponsibilities(db: JooqContext, groupId: String, touchstoneStatus: String)
    {
        db.addGroup(groupId, "description")
        db.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        db.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        db.addTouchstone("touchstone", 1, "description", touchstoneStatus, 1900..2000, addName = true, addStatus = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, "submitted", addStatus = true)
        db.addResponsibility(setId, touchstoneId, "scenario-1")
        db.addResponsibility(setId, touchstoneId, "scenario-2")
    }
}