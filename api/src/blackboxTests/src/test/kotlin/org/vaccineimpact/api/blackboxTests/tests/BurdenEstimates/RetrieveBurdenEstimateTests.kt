package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.addBurdenEstimateProblem
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.models.permissions.PermissionSet


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

}