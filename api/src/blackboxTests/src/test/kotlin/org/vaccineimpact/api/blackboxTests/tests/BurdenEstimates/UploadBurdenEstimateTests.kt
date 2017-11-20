package org.vaccineimpact.api.blackboxTests.tests.BurdenEstimates

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.schemas.CSVSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod


class UploadBurdenEstimateTests : BurdenEstimateTests()
{
    @Test
    fun `can create burden estimate`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        JooqContext().use {
            setUp(it)
        }

        val response = requestHelper.post(setUrl, token = token, data = csvData)
        Assertions.assertThat(response.statusCode).isEqualTo(201)
    }


    @Test
    fun `can populate burden estimate`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        var setId = 0
        JooqContext().use {
            setId = setUpWithBurdenEstimateSet(it)
        }

        val response = requestHelper.post("$setUrl/$setId", token = token, data = csvData)
        Assertions.assertThat(response.statusCode).isEqualTo(200)
    }


    @Test
    fun `can upload burden estimate`()
    {
        validate(url, method = HttpMethod.post) sending {
            csvData
        } given { db ->
            setUp(db)
        } withRequestSchema {
            CSVSchema("BurdenEstimate")
        } requiringPermissions {
            requiredWritePermissions
        } andCheckObjectCreation LocationConstraint(url, unknownId = true)
    }

    @Test
    fun `bad CSV data results in ValidationError`()
    {
        JooqContext().use { setUp(it) }
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions, includeCanLogin = true)
        val helper = RequestHelper()
        val response = helper.post(url, "bad_header,year,age,country,country_name,cohort_size", token = token)
        JSONValidator().validateError(response.text, "csv-unexpected-header")
    }

    @Test
    fun `can upload burden estimate via onetime link`()
    {
        validate("$url/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            Assertions.assertThat(response.statusCode).isEqualTo(201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

    @Test
    fun `can upload burden estimate via onetime link and redirect`()
    {
        validateOneTimeLinkWithRedirect(url)    
    }

    @Test
    fun `can populate burden estimate via onetime link`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        var setId = 0
        JooqContext().use {
            setId = setUpWithBurdenEstimateSet(it)
        }

        val onetimeTokenResult = requestHelper.get("$setUrl/$setId/get_onetime_link/", token)
        val onetimeToken = onetimeTokenResult.montaguData<String>()!!

        val oneTimeURL = "/onetime_link/$onetimeToken/"

        val response = requestHelper.postFile(oneTimeURL, csvData)

        Assertions.assertThat(response.statusCode).isEqualTo(200)
    }

    @Test
    fun `can populate burden estimate via onetime link and redirect`()
    {
        val requestHelper = RequestHelper()
        val token = TestUserHelper.setupTestUserAndGetToken(requiredWritePermissions.plus(PermissionSet("*/can-login")))

        var setId = 0
        JooqContext().use {
            setId = setUpWithBurdenEstimateSet(it)
        }

        val url = "$setUrl/$setId/get_onetime_link/?redirectUrl=http://localhost/"
        val onetimeTokenResult = requestHelper.get(url, token)
        val onetimeToken = onetimeTokenResult.montaguData<String>()!!

        val oneTimeURL = "/onetime_link/$onetimeToken/"
        val response = requestHelper.postFile(oneTimeURL, csvData)
        val resultAsString = response.getResultFromRedirect(checkRedirectTarget = "http://localhost")
        JSONValidator().validateSuccess(resultAsString)
    }

    @Test
    fun `can create burden estimate via onetime link`()
    {
        validate("$setUrl/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            assert(response.statusCode == 201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

    @Test
    fun `can create burden estimate via onetime link and redirect`()
    {
        validateOneTimeLinkWithRedirect(setUrl)
    }

    @Test
    fun `bad CSV data results in ValidationError in redirect`()
    {
        validate("$url/get_onetime_link/?redirectUrl=http://localhost") against "Token" given { db ->
            setUp(db)
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
    fun `can upload model run parameters`()
    {
        validate("$url/get_onetime_link/") against "Token" given { db ->
            setUp(db)
        } requiringPermissions {
            requiredWritePermissions
        } andCheckString { token ->
            val oneTimeURL = "/onetime_link/$token/"
            val requestHelper = RequestHelper()

            val response = requestHelper.postFile(oneTimeURL, csvData)
            Assertions.assertThat(response.statusCode).isEqualTo(201)

            val badResponse = requestHelper.get(oneTimeURL)
            JSONValidator().validateError(badResponse.text, expectedErrorCode = "invalid-token-used")
        }
    }

}
