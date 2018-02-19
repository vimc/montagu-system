package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_STOCHASTIC
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.models.helpers.ContentTypes
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
    fun `can populate burden estimate via onetime link`()
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
    fun `can populate burden estimate via onetime link and redirect`()
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
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        validate("$setUrl/$setId/get_onetime_link/?redirectUrl=http://localhost") against "Token" given { _ ->
            //set up already done
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, "bad_header,year,age,country,country_name,cohort_size")
            val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
            JSONValidator().validateError(resultAsString, expectedErrorCode = "csv-unexpected-header")
        }
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
        val response = helper.post("$setUrl/$setId/", duplicateCsvData, token = token)
        JSONValidator()
                .validateError(response.text, "duplicate-key:burden_estimate_set,country,year,age,burden_outcome")

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
    fun `data in invalid file is not committed when using onetime link with redirect`()
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
        var url = "$setUrl/$setId/get_onetime_link/"
        if (redirect)
        {
            url += "?redirectUrl=http://localhost/"
        }
        val token = TestUserHelper.getToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))
        val onetimeTokenResult = RequestHelper().get(url, token)
        val onetimeToken = onetimeTokenResult.montaguData<String>()!!
        return "/onetime_link/$onetimeToken/"
    }

}