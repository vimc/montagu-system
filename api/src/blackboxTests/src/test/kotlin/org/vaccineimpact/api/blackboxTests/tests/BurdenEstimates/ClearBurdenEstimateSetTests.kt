package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.EmptySchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.db.direct.addCountries
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class ClearBurdenEstimateSetTests : BurdenEstimateTests()
{
    val setId = 1
    val clearUrl = "$setUrl$setId/actions/clear/"

    @Test
    fun `can clear empty burden estimate set`()
    {
        validate(clearUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "empty")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        checkSetHasThisManyRows(0)
    }

    @Test
    fun `can clear burden estimate set with partial estimates`()
    {
        validate(clearUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        checkSetHasThisManyRows(0)
    }

    @Test
    fun `cannot clear burden estimate set in complete status`()
    {
        JooqContext().use { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "complete")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        }
        val r = RequestHelper().post(clearUrl, requiredWritePermissions + PermissionSet("*/can-login"))
        JSONValidator().validateError(r.text, "forbidden",
                "You cannot clear a burden estimate set which is marked as 'complete'")

        checkSetHasThisManyRows(1)
    }

    private fun checkSetHasThisManyRows(expectedCount: Int)
    {
        JooqContext().use { db ->
            val count = db.dsl.selectCount().from(BURDEN_ESTIMATE).fetchOne(0, Int::class.java)
            assertThat(count).isEqualTo(expectedCount)
        }
    }
}