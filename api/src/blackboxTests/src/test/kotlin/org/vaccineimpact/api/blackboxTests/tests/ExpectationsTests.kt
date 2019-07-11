package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ExpectationsTests : DatabaseTest()
{
    private val touchstoneVersionId = "touchstone-1"
    private val groupId = "awesome-group"
    private val groupScope = "modelling-group:$groupId"
    private val scenarioId = "yf-scenario"
    private val otherScenarioID
    private val modelId = "model-1"

    val responsibilitiesUrl = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/"
    val responsibilityUrl = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/"

    @Test
    fun `can get all expectations`()
    {
        validate(responsibilitiesUrl) against "ResponsibilitySet" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            Assertions.assertThat(it["touchstone_version"]).isEqualTo(touchstoneVersionId)
            Assertions.assertThat(it["modelling_group_id"]).isEqualTo(groupId)
            Assertions.assertThat(it["status"]).isEqualTo("submitted")

            @Suppress("UNCHECKED_CAST")
            val responsibilities = it["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            Assertions.assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to
                                "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            Assertions.assertThat(responsibility["status"]).isEqualTo("invalid")
            Assertions.assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            Assertions.assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    @Test
    fun `cannot get all expectations without global read responsibilities scope`()
    {
        val permissions = PermissionSet(
                "*/can-login",
                "*/touchstones.read",
                "$groupScope/responsibilities.read"
        )

        TestUserHelper.setupTestUser()


        val otherGroupId = "other-group"
        JooqContext().use {
            //Create standard responsibilities for test user
            addResponsibilities(it, touchstoneStatus = "open")

            //Create another group with responsibilities, to which the test user does not belong
            it.addGroup(otherGroupId, "another group")
            addResponsibilities(it, touchstoneStatus = "open",
                    includeUserGroupAndTouchstone = false,
                    responsibilityGroupId = otherGroupId,
                    responsibilityModelId = "other-model")
        }

        //sanity check that we can access our own group
        val comparisonUrl = "/modelling-groups/$groupId/responsibilities/"

        val comparisonResponse = RequestHelper().get(comparisonUrl, permissions)

        Assertions.assertThat(comparisonResponse.statusCode).isEqualTo(200)

        val url = "/modelling-groups/$otherGroupId/responsibilities/"

        val response = RequestHelper().get(url, permissions)

        Assertions.assertThat(response.statusCode).isEqualTo(403)
    }

    private fun addExpectations(db: JooqContext): Int
    {
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addTouchstoneVersion("touchstone2", 2, addTouchstone = true)
        db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
        db.addScenarioDescription(otherScenarioId, "other desc", "HepB", addDisease = true)
        db.addGroup(groupId)
        db.addGroup(otherGroupId)
        val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
        val setId2 = db.addResponsibilitySet(otherGroupId, "touchstone2-2")
        val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
        val r2 = db.addResponsibility(setId2, "touchstone2-2", otherScenarioId)
        val expId1 = db.addExpectations(r1)
        val expId2 = db.addExpectations(r2)
        db.addExistingExpectationsToResponsibility(r1, expId1)
        db.addExistingExpectationsToResponsibility(r2, expId2)
    }
}