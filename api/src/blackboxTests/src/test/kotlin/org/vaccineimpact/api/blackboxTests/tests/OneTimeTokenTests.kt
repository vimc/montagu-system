package org.vaccineimpact.api.blackboxTests.tests

import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator

class OneTimeTokenTests : DatabaseTest()
{
    @Test
    fun `can get new style onetime token`()
    {
        validate("/onetime_token/?url=http://localhost/test") against "Token" given {
            //do nothing
        } requiringPermissions {
            PermissionSet("*/can-login")
        }
    }

    @Test
    fun `can use onetime token to access URL`()
    {
        val desiredUrl = "/touchstones/"
        val permissions = PermissionSet("*/can-login", "*/touchstones.read")

        val bearerToken = TestUserHelper.setupTestUserAndGetToken(permissions)
        val requestHelper = RequestHelper()
        val oneTimeToken = requestHelper.getOneTimeToken(desiredUrl, bearerToken)
        val response = RequestHelper().get("$desiredUrl?access_token=$oneTimeToken")

        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `can use onetime token to access URL with query parameters in any order`()
    {
        val desiredUrl = "/touchstones/?b=2&a=1"
        val permissions = PermissionSet("*/can-login", "*/touchstones.read")

        val bearerToken = TestUserHelper.setupTestUserAndGetToken(permissions)
        val requestHelper = RequestHelper()
        val oneTimeToken = requestHelper.getOneTimeToken(desiredUrl, bearerToken)
        val response = RequestHelper().get("/touchstones/?a=1&b=2&access_token=$oneTimeToken")

        JSONValidator().validateSuccess(response.text)
    }

    @Test
    fun `cannot use onetime token to access other URL`()
    {
        val desiredUrl = "/touchstones/"
        val otherUrl = "/touchstones/1/scenarios/"
        val permissions = PermissionSet("*/can-login", "*/touchstones.read")

        val bearerToken = TestUserHelper.setupTestUserAndGetToken(permissions)
        val requestHelper = RequestHelper()
        val oneTimeToken = requestHelper.getOneTimeToken(desiredUrl, bearerToken)
        val response = RequestHelper().get("$otherUrl?access_token=$oneTimeToken")

        JSONValidator().validateError(response.text,
                expectedErrorCode = "forbidden",
                expectedErrorText = "This token is issued for /v1/touchstones/ but the current request is for /v1/touchstones/1/scenarios/"
        )
    }

    @Test
    fun `cannot use onetime token to bypass permissions checks`()
    {
        val desiredUrl = "/touchstones/"
        val permissions = PermissionSet("*/can-login")

        val bearerToken = TestUserHelper.setupTestUserAndGetToken(permissions)
        val requestHelper = RequestHelper()
        val oneTimeToken = requestHelper.getOneTimeToken(desiredUrl, bearerToken)
        val response = RequestHelper().get("$desiredUrl?access_token=$oneTimeToken")

        JSONValidator().validateError(response.text,
                expectedErrorCode = "forbidden",
                expectedErrorText = "You do not have sufficient permissions to access this resource. Missing these permissions: */touchstones.read"
        )
    }
}
