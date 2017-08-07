package org.vaccineimpact.api.blackboxTests.helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.clearRolesForUser
import org.vaccineimpact.api.security.givePermissionsToUserUsingTestRole

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

    fun getTokenForTestUser(permissions: Set<ReifiedPermission>): TokenLiteral
    {
        JooqContext().use {
            it.clearRolesForUser(testUsername)
            for ((scope, subset) in permissions.groupBy { it.scope })
            {
                val names = subset.map { it.name }
                it.givePermissionsToUserUsingTestRole(
                        testUsername,
                        scope.databaseScopePrefix,
                        scope.databaseScopeId,
                        names
                )
            }
        }
        val token = tokenFetcher.getToken(testUserEmail, testUserPassword)
        return when (token)
        {
            is TokenFetcher.TokenResponse.Token -> token.token
            is TokenFetcher.TokenResponse.Error -> throw Exception("Unable to obtain auth token: '${token.message}'")
        }
    }

    companion object
    {
        fun setupTestUser()
        {
            JooqContext().use {
                TestUserHelper().setupTestUser(it)
            }
        }
        fun setupTestUserAndGetToken(permissions: Set<ReifiedPermission>): TokenLiteral
        {
            setupTestUser()
            return TestUserHelper().getTokenForTestUser(permissions)
        }
    }
}