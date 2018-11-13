package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.EmptySchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class CloseBurdenEstimateSetTests : BurdenEstimateTests()
{
    private val setId = 1
    private val closeUrl = "$setUrl$setId/actions/close/"

    @Test
    fun `can close burden estimate set`()
    {
        validate(closeUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId)

            db.addBurdenEstimate(setId, "AFG", age = 50, year = 1996)
            db.addBurdenEstimate(setId, "AFG", age = 50, year = 1997)
            db.addBurdenEstimate(setId, "AGO", age = 50, year = 1996)
            db.addBurdenEstimate(setId, "AGO", age = 50, year = 1997)

        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        JooqContext().use { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId))
            assertThat(record.status).isEqualTo("complete")
        }
    }

    @Test
    fun `set is marked as invalid when there are missing rows`()
    {
        JooqContext().use {
            setUpWithBurdenEstimateSet(it)
            it.addBurdenEstimate(setId, "AFG", age = 50, year = 1996)
        }
        val response = RequestHelper().post(closeUrl,
                requiredWritePermissions + "*/can-login")
        JSONValidator().validateError(response.text, "missing-rows")
        JooqContext().use { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId))
            assertThat(record.status).isEqualTo("invalid")
        }
    }
}