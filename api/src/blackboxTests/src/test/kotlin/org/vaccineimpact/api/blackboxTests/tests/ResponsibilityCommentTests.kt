package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import com.opencsv.CSVReader
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.toJsonObject
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod
import java.io.StringReader
import java.time.Instant

class ResponsibilityCommentTests : DatabaseTest() {
    private val now = Instant.now()
    private val modellingGroupId = "group-1"
    private val scenarioId = "scenario-1"

    private fun JooqContext.setupResponsibilities() {
        TestUserHelper.setupTestUser()
        addGroup(modellingGroupId)
        addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        val responsibilitySet = addResponsibilitySet(modellingGroupId, "touchstone-1")
        addResponsibilitySetComment(
                responsibilitySet,
                "comment 1",
                TestUserHelper.username,
                now
        )
        val responsibilityId = addResponsibility(responsibilitySet, "touchstone-1", scenarioId)
        addResponsibilityComment(
                responsibilityId,
                "comment 2",
                TestUserHelper.username,
                now
        )
        val modelVersionId = addModel("model-1", modellingGroupId, "disease-1", versions = listOf("version-1"))
        addExpectations(responsibilityId)
        val burdenId = addBurdenEstimateSet(responsibilityId, modelVersionId, "test.user", "invalid", setTypeDetails = "unknown", timestamp = now)
        updateCurrentEstimate(responsibilityId, burdenId)
        addBurdenEstimateProblem("42 missing estimate(s)", burdenId)
    }

    @Test
    fun `can get comments`() {
        validate("/touchstones/touchstone-1/responsibilities/comments/") against "ResponsibilitySetsWithComments" given {
            it.setupResponsibilities()
        } requiringPermissions {
            PermissionSet("*/touchstones.read", "*/responsibilities.review")
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(
                        obj(
                                "touchstone_version" to "touchstone-1",
                                "modelling_group_id" to "group-1",
                                "comment" to obj(
                                        "comment" to "comment 1",
                                        "added_by" to "test.user",
                                        "added_on" to now.toString()
                                ),
                                "responsibilities" to array(
                                        obj(
                                                "scenario_id" to "scenario-1",
                                                "comment" to obj(
                                                        "comment" to "comment 2",
                                                        "added_by" to "test.user",
                                                        "added_on" to now.toString()
                                                )
                                        )
                                )
                        )
                )
            })
        }
    }

    @Test
    fun `can add responsibility comment`() {
        validate("/touchstones/touchstone-1/comments/$modellingGroupId/$scenarioId/", HttpMethod.post) given {
            it.setupResponsibilities()
        } sendingJSON {
            mapOf("comment" to "comment 3").toJsonObject()
        } withPermissions {
            PermissionSet("*/touchstones.read", "*/responsibilities.review")
        } withRequestSchema "ResponsibilityComment" andCheckString {
            assertThat(it).isEqualTo("OK")
        }
    }

    @Test
    fun `can add responsibility set comment`() {
        validate("/touchstones/touchstone-1/comments/$modellingGroupId/", HttpMethod.post) given {
            it.setupResponsibilities()
        } sendingJSON {
            mapOf("comment" to "comment 4").toJsonObject()
        } withPermissions {
            PermissionSet("*/touchstones.read", "*/responsibilities.review")
        } withRequestSchema "ResponsibilityComment" andCheckString {
            assertThat(it).isEqualTo("OK")
        }
    }

    @Test
    fun `can get responsibilities data for touchstone`(){
        JooqContext().use {
            it.setupResponsibilities()
        }

        val responsibilitiesUrl = "/touchstones/touchstone-1/responsibilities/csv/"
        val permissions = PermissionSet(
                "*/can-login",
                "*/touchstones.read",
                "*/responsibilities.review"
        )
        val response = RequestHelper().get(responsibilitiesUrl, permissions, acceptsContentType = "text/csv")

        assertThat(response.headers["Content-Type"]).isEqualTo("text/csv")
        assertThat(response.headers["Content-Disposition"])
                .isEqualTo("attachment; filename=\"responsibilities_touchstone-1.csv\"")

        val schema = CSVSchema("ResponsibilitySetsWithComments")
        schema.validate(response.text)

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }
        val dataRow = csv.drop(1).first().toList()
        assertThat(dataRow).isEqualTo(listOf(
                "touchstone-1",
                "group-1",
                "1",
                "comment 1",
                now.toString(),
                "test.user",
                "description 1",
                "disease-1",
                "1",
                now.toString(),
                "test.user",
                "central-single-run",
                "unknown",
                "invalid",
                "42 missing estimate(s)",
                "comment 2",
                now.toString(),
                "test.user"
        ))
    }
}
