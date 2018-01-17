package org.vaccineimpact.api.blackboxTests.helpers

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.clearRolesForUser
import org.vaccineimpact.api.security.givePermissionsToUserUsingTestRole

class TestUserHelper(private val password: String = TestUserHelper.defaultPassword)
{
    private val tokenFetcher = TokenFetcher()

    fun setupTestUser(db: JooqContext)
    {
        if (!UserHelper.userExists(db.dsl, username))
        {
            UserHelper.saveUser(db.dsl, username, "Test User", email, password)
        }
    }

    fun getTokenForTestUser(
            permissions: Set<ReifiedPermission> = emptySet(),
            includeCanLogin: Boolean = false
    ): TokenLiteral
    {
        val extraPermissions = if (includeCanLogin)
        {
            setOf(ReifiedPermission("can-login", Scope.Global()))
        }
        else
        {
            emptySet()
        }

        JooqContext().use {
            it.clearRolesForUser(username)
            for ((scope, subset) in (permissions + extraPermissions).groupBy { it.scope })
            {
                val names = subset.map { it.name }
                it.givePermissionsToUserUsingTestRole(
                        username,
                        scope.databaseScopePrefix,
                        scope.databaseScopeId,
                        names
                )
            }
        }
        val token = tokenFetcher.getToken(email, password)
        return when (token)
        {
            is TokenFetcher.TokenResponse.Token -> token.token
            is TokenFetcher.TokenResponse.Error -> throw Exception("Unable to obtain auth token: '${token.message}'")
        }
    }

    companion object
    {
        val username = "test.user"
        val email = "user@test.com"
        val defaultPassword = "test"

        fun setupTestUser()
        {
            JooqContext().use {
                TestUserHelper().setupTestUser(it)
            }
        }

        fun setupTestUserAndGetToken(
                permissions: Set<ReifiedPermission>,
                includeCanLogin: Boolean = false
        ): TokenLiteral
        {
            setupTestUser()
            return TestUserHelper().getTokenForTestUser(permissions, includeCanLogin)
        }

        fun getToken(
                permissions: Set<ReifiedPermission>,
                includeCanLogin: Boolean = false
        ): TokenLiteral
        {
            return TestUserHelper().getTokenForTestUser(permissions, includeCanLogin)
        }
    }
}