package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.createPermissions
import org.vaccineimpact.api.db.direct.createRole
import org.vaccineimpact.api.db.direct.ensureUserHasRole
import org.vaccineimpact.api.db.direct.setRolePermissions
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.security.UserHelper

class UserTests : RepositoryTests<UserRepository>()
{
    val username = "test.user"
    val email = "test@example.com"
    override fun makeRepository() = JooqUserRepository()

    private fun addTestUser(db: JooqContext)
    {
        UserHelper.saveUser(db.dsl, username, "Test User",email, "password")
    }

    @Test
    fun `can retrieve user with any case email address`()
    {
        given(this::addTestUser).check { repo ->
            checkUser(getUser(repo, email), emptyList())
            checkUser(getUser(repo, email.toUpperCase()), emptyList())
        }
    }

    @Test
    fun `cannot retrieve user with incorrect email address`()
    {
        given(this::addTestUser).check { repo ->
            assertThat(repo.getUserByEmail(username)).isNull()
            assertThat(repo.getUserByEmail("Test User")).isNull()
        }
    }

    @Test
    fun `can retrieve user with globally scoped permissions`()
    {
        given {
            addTestUser(it)
            val roleId = it.createRole("role", scopePrefix = null, description = "Role")
            it.setRolePermissions(roleId, listOf("p1", "p2"), createPermissions = true)
            it.ensureUserHasRole("test.user", roleId, scopeId = "")
        } check { repo ->
            checkUser(getUser(repo, email), listOf(
                    ReifiedPermission("p1", Scope.Global()),
                    ReifiedPermission("p2", Scope.Global())
            ))
        }
    }

    @Test
    fun `can retrieve user with specifically scoped permissions`()
    {
        given {
            addTestUser(it)
            val roleGlobal = it.createRole("a", scopePrefix = null, description = "Role Global")
            val roleA = it.createRole("a", scopePrefix = "prefixA", description = "Role A")
            val roleB = it.createRole("b", scopePrefix = "prefixB", description = "Role B")
            it.createPermissions(listOf("p1", "p2", "p3"))
            it.setRolePermissions(roleGlobal, listOf("p1"))
            it.setRolePermissions(roleA, listOf("p1", "p2"))
            it.setRolePermissions(roleB, listOf("p1", "p3"))
            it.ensureUserHasRole("test.user", roleGlobal, scopeId = "")
            it.ensureUserHasRole("test.user", roleA, scopeId = "idA")
            it.ensureUserHasRole("test.user", roleB, scopeId = "idB")
        } check { repo ->
            checkUser(getUser(repo, email), listOf(
                    ReifiedPermission("p1", Scope.Global()),
                    ReifiedPermission("p1", Scope.Specific("prefixA", "idA")),
                    ReifiedPermission("p2", Scope.Specific("prefixA", "idA")),
                    ReifiedPermission("p1", Scope.Specific("prefixB", "idB")),
                    ReifiedPermission("p3", Scope.Specific("prefixB", "idB"))
            ))
        }
    }

    private fun checkUser(user: User, expectedPermissions: List<ReifiedPermission>)
    {
        assertThat(user.username).isEqualTo("test.user")
        assertThat(user.name).isEqualTo("Test User")
        assertThat(user.email).isEqualTo("test@example.com")
        assertThat(user.permissions).hasSameElementsAs(expectedPermissions)
    }

    private fun getUser(repository: UserRepository, email: String): User
    {
        val user = repository.getUserByEmail(email)
        assertThat(user).isNotNull()
        return user!!
    }
}