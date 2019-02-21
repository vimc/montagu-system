package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import khttp.responses.Response
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
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
        validate("$setUrl$setId/?keepOpen=true", method = HttpMethod.post) withRequestSchema {
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
        val response = RequestHelper().postFile("$setUrl$setId/?keepOpen=true", csvData, token = token)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can populate burden estimate and redirect`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().post("$setUrl$setId/?keepOpen=true&redirectResultTo=http://localhost", csvData, token)
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
        validate("$setUrl/$setId/?keepOpen=true", method = HttpMethod.post) withRequestSchema {
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

    @Test
    fun `can get token for burden estimate uploads`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val response = RequestHelper().get("$setUrl$setId/actions/request-upload/", token = token)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can upload file in 1 chunk`() {

        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val fileName = "test.csv"
        val size = csvData.toByteArray().size

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)

        val queryParams = mapOf("resumableChunkNumber" to 1,
                "resumableTotalSize" to size,
                "resumableChunkSize" to size,
                "resumableIdentifier" to uploadToken,
                "resumableFilename" to  fileName,
                "resumableTotalChunks" to 1)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        val response = RequestHelper().postFile("$setUrl$setId/actions/upload/$uploadToken/?$queryParams", csvData, token = token)
        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can upload by multiple chunks`() {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it, yearMinInclusive = 1996, yearMaxInclusive = 1999)
        }

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)
        val chunkSize = 100
        val data = longCsvData.chunked(chunkSize)
        val numChunks = data.count()

        for (i in 0 until numChunks)
        {
            val response = sendChunk(setId, i + 1, data[i], numChunks, uploadToken, token)
            JSONValidator().validateSuccess(response.text)
        }
    }

    @Test
    fun `cannot reuse an upload token for a different file`() {

        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val fileName = "test.csv"
        val size = csvData.toByteArray().size

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)

        var response = sendChunk(setId, 1, csvData, 1, uploadToken, token)
        JSONValidator().validateSuccess(response.text)

        val newMetadata = mapOf("resumableChunkNumber" to 1,
                "resumableTotalSize" to size,
                "resumableChunkSize" to 1,
                "resumableIdentifier" to uploadToken,
                "resumableFilename" to  fileName,
                "resumableTotalChunks" to 1)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        response = RequestHelper().postFile("$setUrl$setId/actions/upload/$uploadToken/?$newMetadata", csvData, token = token)
        JSONValidator().validateError(response.text, "bad-request",
                "The given token has already been used to upload a different file. Please request a fresh upload token.")
    }

    private fun getUploadToken(setUrl: String, token: TokenLiteral) : String {
        val response = RequestHelper().get("$setUrl/actions/request-upload/", token = token)
        val json = com.beust.klaxon.Parser().parse(StringBuilder(response.text)) as com.beust.klaxon.JsonObject
        return json["data"] as String
    }

    private fun sendChunk(setId: Int,
                          number: Int,
                          chunk: String,
                          total: Int,
                          uploadToken: String,
                          token: TokenLiteral): Response
    {
        val queryParams = mapOf("resumableChunkNumber" to number,
                "resumableChunkSize" to 100,
                "resumableTotalSize" to 1000,
                "resumableIdentifier" to uploadToken,
                "resumableFilename" to "test.csv",
                "resumableTotalChunks" to total)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        val response = RequestHelper().postFile("$setUrl$setId/actions/upload/$token/?$queryParams", chunk, token = token)
        JSONValidator().validateSuccess(response.text)
        return response
    }
}