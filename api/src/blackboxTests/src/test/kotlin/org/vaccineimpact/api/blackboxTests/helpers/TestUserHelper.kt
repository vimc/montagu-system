package org.vaccineimpact.api.blackboxTests.helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.givePermissionsToUserUsingTestRole
import org.vaccineimpact.api.security.UserHelper

class TestUserHelper
{
    val testUsername = "test.user"
    val testUserEmail = "user@test.com"
    val testUserPassword = "test"
    private val tokenFetcher = TokenFetcher()

    fun setupTestUser(db: JooqContext)
    {
        UserHelper.saveUser(db.dsl, testUsername, "Test User", testUserEmail, testUserPassword)
    }

    fun getTokenForTestUser(permissions: Set<String>): String
    {
        JooqContext().use {
            it.givePermissionsToUserUsingTestRole(testUsername, permissions.toList())
        }
        val token = tokenFetcher.getToken(testUserEmail, testUserPassword)
        return when (token)
        {
            is TokenFetcher.TokenResponse.Token -> token.token
            is TokenFetcher.TokenResponse.Error -> throw Exception("Unable to obtain auth token: '${token.message}'")
        }
    }
}