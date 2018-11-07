package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.getResultFromRedirect
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_STOCHASTIC
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

class PopulateBurdenEstimateTests : BurdenEstimateTests()
{
    override val usesAnnex = true

    @Test
    fun `can populate central burden estimate`()
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
            val records = db.dsl.select(BURDEN_ESTIMATE.fieldsAsList())
                    .from(BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isNotEmpty
        }
    }

    @Test
    fun `can populate central burden estimate via multipart file upload`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().postFile("$setUrl$setId/", csvData, token = token)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can populate burden estimate and redirect`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().post("$setUrl$setId/?redirectResultTo=http://localhost", csvData, token)
        val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
        JSONValidator().validateSuccess(resultAsString)
    }

    @Test
    fun `cannot provide stochastic data for central estimates`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val response = RequestHelper().post("$setUrl/$setId/",
                requiredWritePermissions + "*/can-login", stochasticCSVData)
        JSONValidator().validateError(response.text, "csv-unexpected-header",
                "Expected column header 'year'; found 'run_id' instead (column 1)")
    }

    @Test
    fun `can populate stochastic burden estimate`()
    {
        TestUserHelper.setupTestUser()
        val setId = JooqContext().use {
            setUpWithStochasticBurdenEstimateSet(it)
        }
        validate("$setUrl/$setId/", method = HttpMethod.post) withRequestSchema {
            CSVSchema("StochasticBurdenEstimate")
        } sending {
            stochasticCSVData
        } withPermissions {
            requiredWritePermissions
        } andCheckHasStatus 200..299
    }

    @Test
    fun `cannot provide central data for stochastic estimates`()
    {
        TestUserHelper.setupTestUser()
        val setId = JooqContext().use {
            setUpWithStochasticBurdenEstimateSet(it)
        }
        val response = RequestHelper().post("$setUrl/$setId/",
                requiredWritePermissions + "*/can-login", csvData)
        JSONValidator().validateError(response.text, "csv-unexpected-header",
                "Expected column header 'run_id'; found 'year' instead (column 1)")
    }

    @Test
    fun `bad CSV headers results in ValidationError`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.getToken(requiredWritePermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val response = helper.post("$setUrl/$setId/", "bad_header,year,age,country,country_name,cohort_size", token = token)
        JSONValidator().validateError(response.text, "csv-unexpected-header")
    }

    @Test
    fun `bad CSV data results in ValidationError`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.getToken(requiredWritePermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val response = helper.post("$setUrl/$setId/", badCSVData, token = token)
        JSONValidator().validateError(response.text, "csv-bad-data-type:1:cohort_size")
    }

    @Test
    fun `can populate burden estimate with onetime token`()
    {
        val requestHelper = RequestHelper()
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val oneTimeURL = getPopulateOneTimeURL(setId)
        val response = requestHelper.post(oneTimeURL, csvData)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can populate burden estimate with onetime token multipart file upload`()
    {
        val requestHelper = RequestHelper()
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val oneTimeURL = getPopulateOneTimeURL(setId)
        val response = requestHelper.postFile(oneTimeURL, csvData)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can populate burden estimate with onetime token and redirect`()
    {
        val requestHelper = RequestHelper()

        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val oneTimeURL = getPopulateOneTimeURL(setId, redirect = true)
        val response = requestHelper.postFile(oneTimeURL, csvData)
        val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
        JSONValidator().validateSuccess(resultAsString)
    }

    @Test
    fun `bad CSV headers results in ValidationError in redirect`()
    {
        val requestHelper = RequestHelper()

        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val oneTimeURL = getPopulateOneTimeURL(setId, redirect = true)
        val response = requestHelper.postFile(oneTimeURL, "bad_header,year,age,country,country_name,cohort_size")
        val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
        JSONValidator().validateError(resultAsString, expectedErrorCode = "csv-unexpected-header")

    }

    @Test
    fun `cannot populate central burden estimate set if duplicate rows`()
    {
        TestUserHelper.setupTestUser()
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.getToken(requiredWritePermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val longDuplicateData = duplicateCsvData + (1..10000).map {
            """
                |"Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
                |""".trimMargin()
        }.joinToString("")

        val response = helper.post("$setUrl/$setId/", longDuplicateData, token = token)
        JSONValidator()
                .validateError(response.text, "inconsistent-data")

    }

    @Test
    fun `cannot populate stochastic burden estimate set if duplicate rows`()
    {
        TestUserHelper.setupTestUser()
        val setId = JooqContext().use {
            setUpWithStochasticBurdenEstimateSet(it)
        }
        val token = TestUserHelper.getToken(requiredWritePermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val response = helper.post("$setUrl/$setId/", duplicateStochasticCSVData, token = token)
        val expectedError = "duplicate-key:burden_estimate_set,model_run,country,year,age,burden_outcome"
        JSONValidator().validateError(response.text, expectedError)
        JooqContext().use {
            val records = it.dsl
                    .select(BURDEN_ESTIMATE_STOCHASTIC.fieldsAsList())
                    .from(BURDEN_ESTIMATE_STOCHASTIC)
                    .fetch()
            assertThat(records).isEmpty()
        }
    }

    @Test
    fun `data in invalid file is not committed when using onetime token with redirect`()
    {
        TestUserHelper.setupTestUser()
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val oneTimeURL = getPopulateOneTimeURL(setId, redirect = true)
        val response = RequestHelper().postFile(oneTimeURL, wrongOutcomeCSVData)
        val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
        JSONValidator().validateError(resultAsString)

        JooqContext().use { db ->
            val records = db.dsl.select(BURDEN_ESTIMATE.fieldsAsList())
                    .from(BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isEmpty()
        }
    }

    private fun getPopulateOneTimeURL(setId: Int, redirect: Boolean = false): String
    {
        var url = "$setUrl/$setId/?"
        if (redirect)
        {
            url += "&redirectResultTo=http://localhost/"
        }
        val token = TestUserHelper.getToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))
        val oneTimeToken = RequestHelper().getOneTimeToken(url, token)
        return "$url&access_token=$oneTimeToken"
    }

}