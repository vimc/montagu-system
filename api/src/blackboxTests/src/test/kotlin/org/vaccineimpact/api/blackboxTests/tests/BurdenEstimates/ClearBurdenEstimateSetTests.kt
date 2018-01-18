package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.EmptySchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.db.direct.addCountries
import spark.route.HttpMethod

class ClearBurdenEstimateSetTests : BurdenEstimateTests()
{
    @Test
    fun `can clear empty burden estimate set`()
    {
        val setId = 1
        validate("$setUrl$setId/actions/clear/", method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "empty")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        JooqContext().use { db ->
            val count = db.dsl.selectCount().from(BURDEN_ESTIMATE).fetchOne(0, Int::class.java)
            assertThat(count).isEqualTo(0)
        }
    }

    @Test
    fun `can clear burden estimate set with partial estimates`()
    {
        val setId = 1
        validate("$setUrl$setId/actions/clear/", method = HttpMethod.post) withRequestSchema {
            EmptySchema
        } given { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")
            db.addCountries(listOf("ABC", "DEF"))
            db.addBurdenEstimate(setId, "ABC")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..200

        JooqContext().use { db ->
            val count = db.dsl.selectCount().from(BURDEN_ESTIMATE).fetchOne(0, Int::class.java)
            assertThat(count).isEqualTo(0)
        }
    }
}