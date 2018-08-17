package org.vaccineimpact.api.blackboxTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AuthorizationTests : DatabaseTest()
{
    @Before
    fun createTestUser()
    {
        TestUserHelper.setupTestUser()
    }

    @Test
    fun `can access protected URL with bearer token`()
    {
        val response = RequestHelper().get("/diseases/", getToken())
        assertThat(response.statusCode).isEqualTo(200)
    }

    @Test
    fun `can access protected URL with cookie token`()
    {
        val response = RequestHelper().getWithCookie("/diseases/", getToken())
        assertThat(response.statusCode).isEqualTo(200)
    }

    @Test
    fun `can access protected URL with one time parameter token`()
    {
        val oneTimeToken = RequestHelper().getOneTimeToken("/diseases/", getToken())
        val response = RequestHelper().get("/diseases/?access_token=$oneTimeToken")
        assertThat(response.statusCode).isEqualTo(200)
    }

    private fun getToken() = TestUserHelper.getToken(PermissionSet("*/can-login"))
}