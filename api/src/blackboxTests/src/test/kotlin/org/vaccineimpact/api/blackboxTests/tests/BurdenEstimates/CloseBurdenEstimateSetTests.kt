package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.addBurdenEstimate
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class CloseBurdenEstimateSetTests : BurdenEstimateTests()
{
    private val setId = 1
    private val closeUrl = "$setUrl$setId/actions/close/"

    @Test
    fun `can close burden estimate set`()
    {
        JooqContext().use { db ->
            setUpWithBurdenEstimateSet(db, setId = setId, status = "partial")

            db.addBurdenEstimate(setId, "AFG", age = 50, year = 1996)
            db.addBurdenEstimate(setId, "AFG", age = 50, year = 1997)
            db.addBurdenEstimate(setId, "AGO", age = 50, year = 1996)
            db.addBurdenEstimate(setId, "AGO", age = 50, year = 1997)
        }

        assertSetHasStatus("partial", setId)

        val response = RequestHelper().post(closeUrl,
                requiredWritePermissions + "*/can-login")

        JSONValidator().validateSuccess(response.text)

        assertSetHasStatus("complete", setId)
    }

    @Test
    fun `set is marked as invalid when there are missing rows`()
    {
        JooqContext().use {
            setUpWithBurdenEstimateSet(it, status = "partial")
            it.addBurdenEstimate(setId, "AFG", age = 50, year = 1996)
        }
        val response = RequestHelper().post(closeUrl,
                requiredWritePermissions + "*/can-login")
        assertThat(response.statusCode).isEqualTo(400)
        JSONValidator().validateError(response.text, expectedErrorCode = "missing-rows")
        assertSetHasStatus("invalid", setId)
    }

    @Test
    fun `can populate and close central burden estimate`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        validate("$setUrl$setId/", method = HttpMethod.post) withRequestSchema {
            CSVSchema("BurdenEstimate")
        } sending {
            csvData
        } withPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..299

        JooqContext().use { db ->
            val records = db.dsl.select(Tables.BURDEN_ESTIMATE.fieldsAsList())
                    .from(Tables.BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isNotEmpty
        }

        assertSetHasStatus("complete", setId)
    }

    @Test
    fun `can populate and close central burden estimate via multipart file upload`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("$setUrl$setId/", csvData, token = token)
        JSONValidator().validateSuccess(response.text)

        assertSetHasStatus("complete", setId)
    }

    @Test
    fun `populate returns missing rows error if closing set with missing data`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("$setUrl$setId/", partialCSVData, token = token)
        JSONValidator().validateError(response.text, expectedErrorCode = "missing-rows")
        assertSetHasStatus("invalid", setId)
    }

    private fun assertSetHasStatus(status: String, setId: Int){

        JooqContext().use { db ->
            val record = db.dsl.fetchOne(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE_SET.ID.eq(setId))
            assertThat(record.status).isEqualTo(status)
        }
    }
}