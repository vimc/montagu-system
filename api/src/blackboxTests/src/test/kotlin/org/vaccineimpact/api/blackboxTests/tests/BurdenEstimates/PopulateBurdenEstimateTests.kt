package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import khttp.responses.Response
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.TokenLiteral
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
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
        AnnexJooqContext().use {
            val records = it.dsl
                    .select(BURDEN_ESTIMATE_STOCHASTIC.fieldsAsList())
                    .from(BURDEN_ESTIMATE_STOCHASTIC)
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
    fun `can upload file in 1 chunk and then populate set`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val fileName = "test.csv"
        val size = csvData.toByteArray().size

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)

        val queryParams = mapOf("chunkNumber" to 1,
                "totalSize" to size,
                "chunkSize" to size,
                "fileName" to fileName,
                "totalChunks" to 1)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        val response = RequestHelper().postFile("$setUrl$setId/actions/upload/$uploadToken/?$queryParams", csvData, token = token)
        JSONValidator().validateSuccess(response.text)

        val populateResponse = populateFromFile(setId, uploadToken, token)
        JSONValidator().validateSuccess(populateResponse.text)

        JooqContext().use { db ->
            val records = db.dsl.select(BURDEN_ESTIMATE.fieldsAsList())
                    .from(BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isNotEmpty

            val metadata = db.dsl.selectFrom(BURDEN_ESTIMATE_SET)
                    .fetchOne()
            assertThat(metadata[BURDEN_ESTIMATE_SET.ORIGINAL_FILENAME]).isEqualTo("test.csv")
        }
    }

    @Test
    fun `can upload file by multiple chunks and then populate set`()
    {
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

        val response = populateFromFile(setId, uploadToken, token)
        JSONValidator().validateSuccess(response.text)

        JooqContext().use { db ->
            val records = db.dsl.select(BURDEN_ESTIMATE.fieldsAsList())
                    .from(BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isNotEmpty
        }
    }

    @Test
    fun `can upload file by multiple chunks and get validation error on set population`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
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

        val response = populateFromFile(setId, uploadToken, token)
        assertThat(response.text).contains("We are not expecting data for age 50 and year 1998")

        JooqContext().use { db ->
            val records = db.dsl.select(BURDEN_ESTIMATE.fieldsAsList())
                    .from(BURDEN_ESTIMATE)
                    .fetch()
            assertThat(records).isEmpty()
        }
    }

    @Test
    fun `cannot reuse an upload token for a different file`()
    {

        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it)
        }

        val fileName = "test.csv"
        val size = csvData.toByteArray().size

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)

        var response = sendChunk(setId, 1, csvData, 1, uploadToken, token)
        JSONValidator().validateSuccess(response.text)

        val newMetadata = mapOf("chunkNumber" to 1,
                "totalSize" to size,
                "chunkSize" to 1,
                "fileName" to fileName,
                "totalChunks" to 1)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        response = RequestHelper().postFile("$setUrl$setId/actions/upload/$uploadToken/?$newMetadata", csvData, token = token)
        JSONValidator().validateError(response.text, "bad-request",
                "The given token has already been used to upload a different file. Please request a fresh upload token.")
    }

    @Test
    fun `populating set fails if file is not fully uploaded`()
    {
        val setId = JooqContext().use {
            setUpWithBurdenEstimateSet(it, yearMinInclusive = 1996, yearMaxInclusive = 1999)
        }

        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val uploadToken = getUploadToken("$setUrl$setId", token)

        val chunkSize = 100
        val data = longCsvData.chunked(chunkSize)
        val numChunks = data.count()

        sendChunk(setId, 1, data[0], numChunks, uploadToken, token)

        val response = populateFromFile(setId, uploadToken, token)
        assertThat(response.text).contains("This file has not been fully uploaded")
        assertThat(response.statusCode).isEqualTo(400)
    }

    private fun getUploadToken(setUrl: String, token: TokenLiteral): String
    {
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
        val queryParams = mapOf("chunkNumber" to number,
                "chunkSize" to 100,
                "totalSize" to 1000,
                "fileName" to "test.csv",
                "totalChunks" to total)
                .map { "${it.key}=${it.value}" }
                .joinToString("&")

        val response = RequestHelper().postFile("$setUrl$setId/actions/upload/$uploadToken/?$queryParams", chunk, token = token)
        JSONValidator().validateSuccess(response.text)
        return response
    }

    private fun populateFromFile(setId: Int,
                                 uploadToken: String,
                                 token: TokenLiteral): Response
    {
        return RequestHelper().post("$setUrl$setId/actions/populate/$uploadToken/", token = token)
    }
}