package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.db.JooqContext


class RetrieveBurdenEstimateTests : BurdenEstimateTests()
{
    @Test
    fun `can get burden estimate sets`()
    {
        validate(setUrl) against "BurdenEstimates" given { db ->
            val ids = setUp(db)
            db.addUserForTesting("some.user")
            val setId = db.addBurdenEstimateSet(ids.responsibilityId, ids.modelVersionId, "some.user",
                    setType = "central-averaged", setTypeDetails = "mean")
            db.addBurdenEstimateProblem("a problem", setId)
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.read",
                    "$groupScope/responsibilities.read"
            )
        } andCheckArray { data ->
            val obj = data.first() as JsonObject
            assertThat(obj["uploaded_by"]).isEqualTo("some.user")
            assertThat(obj["problems"]).isEqualTo(json {
                array("a problem")
            })
            assertThat(obj["type"]).isEqualTo(json {
                obj("type" to "central-averaged", "details" to "mean")
            })
        }
    }

    @Test
    fun `can get single burden estimate set`()
    {
        validate("${setUrl}1/") against "BurdenEstimateSet" given { db ->
            val ids = setUp(db)
            db.addUserForTesting("some.user")
            val setId = db.addBurdenEstimateSet(ids.responsibilityId, ids.modelVersionId, "some.user",
                    setType = "central-averaged", setTypeDetails = "mean")
            db.addBurdenEstimateProblem("a problem", setId)
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.read",
                    "$groupScope/responsibilities.read"
            )
        } andCheck { data ->
            assertThat(data["uploaded_by"]).isEqualTo("some.user")
            assertThat(data["problems"]).isEqualTo(json {
                array("a problem")
            })
            assertThat(data["type"]).isEqualTo(json {
                obj("type" to "central-averaged", "details" to "mean")
            })
        }
    }

    @Test
    fun `getting nonexistent burden estimate set returns a 404`()
    {
        val url = "${setUrl}99/"
        val permissions = PermissionSet(
                "*/can-login",
                "$groupScope/estimates.read",
                "$groupScope/responsibilities.read"
        )

        JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val response = RequestHelper().get(url, permissions)

        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }

    @Test
    fun `can get estimated deaths for scenario`()
    {
        validate("$setUrl/1/estimates/deaths/") against "ChartSeries" given { db ->
            val returnedIds = setUp(db)
            TestUserHelper.setupTestUser()

            db.addExpectations(returnedIds.responsibilityId, yearMinInclusive = 1996, yearMaxInclusive = 1997,
                    ageMaxInclusive = 50, ageMinInclusive = 50, countries = listOf("AFG", "AGO"))
            db.addBurdenEstimateSet(
                    returnedIds.responsibilityId,
                    returnedIds.modelVersionId,
                    TestUserHelper.username,
                    status = "complete",
                    setId = 1)
            db.updateCurrentEstimate(returnedIds.responsibilityId, 1)
            db.addBurdenEstimate(1, "AFG", age = 50, year = 1996, value = 100F, outcome = "deaths")
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.read",
                    "$groupScope/responsibilities.read"
            )
        } andCheck { data ->
            assertThat(data["50"]).isEqualTo(json {
                array(obj("x" to 1996, "y" to 100.0))
            })
        }
    }

    @Test
    fun `can get estimated cases for scenario`()
    {
        validate("$setUrl/1/estimates/cases/") against "ChartSeries" given { db ->
            val returnedIds = setUp(db)
            TestUserHelper.setupTestUser()

            db.addExpectations(returnedIds.responsibilityId, yearMinInclusive = 1996, yearMaxInclusive = 1997,
                    ageMaxInclusive = 50, ageMinInclusive = 50, countries = listOf("AFG", "AGO"))
            db.addBurdenEstimateSet(
                    returnedIds.responsibilityId,
                    returnedIds.modelVersionId,
                    TestUserHelper.username,
                    status = "complete",
                    setId = 1)
            db.updateCurrentEstimate(returnedIds.responsibilityId, 1)
            db.addBurdenEstimate(1, "AFG", age = 50, year = 1996, value = 100F, outcome = "cases")
        } requiringPermissions {
            PermissionSet(
                    "$groupScope/estimates.read",
                    "$groupScope/responsibilities.read"
            )
        } andCheck { data ->
            assertThat(data["50"]).isEqualTo(json {
                array(obj("x" to 1996, "y" to 100.0))
            })
        }
    }

}