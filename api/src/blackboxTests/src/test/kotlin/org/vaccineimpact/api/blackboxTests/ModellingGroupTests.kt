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
            listOf("modelling-groups.read")
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
            listOf("responsibilities.read", "scenarios.read")
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
    fun `only touchstone preparer can see in-preparation responsibilities`()
    {
        val group = "groupId"
        val minimumPermissions = listOf("can-login", "responsibilities.read", "scenarios.read")
        val extraPermissions = listOf("touchstones.prepare")
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