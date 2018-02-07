package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.EmptySchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import spark.route.HttpMethod

class CloseBurdenEstimateSetTests : BurdenEstimateTests()
{
    private val setId = 1
    private val closeUrl = "$setUrl$setId/actions/complete/"

    @Test
    fun `can close burden estimate set`()
    {
        validate(closeUrl, method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        JooqContext().use { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId))
            assertThat(record.status).isEqualTo("complete")
        }
    }
}