package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.permissions.RoleAssignment
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.security.createRole
import org.vaccineimpact.api.security.ensureUserHasRole
import org.vaccineimpact.api.security.setRolePermissions

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
            checkUser(getUser(repo, email))
            checkUser(getUser(repo, email.toUpperCase()))
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
    fun `can retrieve user with any case username`()
    {
        given(this::addTestUser).check { repo ->
            assertThat(repo.getUserByUsername("test.user")).isNotNull()
            assertThat(repo.getUserByUsername("Test.User")).isNotNull()
        }
    }

    @Test
    fun `cannot retrieve user with incorrect username`()
    {
        given(this::addTestUser).check { repo ->
            assertThat(repo.getUserByUsername("Test User")).isNull()
        }
    }

    @Test
    fun `retrieves user by username with roles`()
    {
        given {
            addTestUser(it)
            val roleGlobal = it.createRole("role", scopePrefix = null, description = "Role Global")
            val roleA = it.createRole("a", scopePrefix = "prefixA", description = "Role A")
            val roleB = it.createRole("b", scopePrefix = "prefixB", description = "Role B")
            it.ensureUserHasRole("test.user", roleGlobal, scopeId = "")
            it.ensureUserHasRole("test.user", roleA, scopeId = "idA")
            it.ensureUserHasRole("test.user", roleB, scopeId = "idB")
        } check { repo ->

            val expectedRoles = listOf(
                    RoleAssignment("role", "", null),
                    RoleAssignment("a", "idA", "prefixA"),
                    RoleAssignment("b", "idB", "prefixB"))

            var user = repo.getUserByUsername("test.user")!!

            assertThat(user.username).isEqualTo("test.user")
            assertThat(user.name).isEqualTo("Test User")
            assertThat(user.email).isEqualTo("test@example.com")
            assertThat(user.roles).hasSameElementsAs(expectedRoles)
        }
    }

    @Test
    fun `can retrieve user by email with globally scoped permissions`()
    {
        given {
            addTestUser(it)
            val roleId = it.createRole("role", scopePrefix = null, description = "Role")
            createPermissions(it, listOf("p1", "p2"))
            it.setRolePermissions(roleId, listOf("p1", "p2"))
            it.ensureUserHasRole("test.user", roleId, scopeId = "")
        } check { repo ->
            val roles = listOf(ReifiedRole("role", Scope.Global()))
            val permissions = listOf(
                    ReifiedPermission("p1", Scope.Global()),
                    ReifiedPermission("p2", Scope.Global())
            )
            checkUser(getUser(repo, email), roles, permissions)
        }
    }

    @Test
    fun `can retrieve user by email with specifically scoped permissions`()
    {
        given {
            addTestUser(it)
            val roleGlobal = it.createRole("a", scopePrefix = null, description = "Role Global")
            val roleA = it.createRole("a", scopePrefix = "prefixA", description = "Role A")
            val roleB = it.createRole("b", scopePrefix = "prefixB", description = "Role B")
            createPermissions(it, listOf("p1", "p2", "p3"))
            it.setRolePermissions(roleGlobal, listOf("p1"))
            it.setRolePermissions(roleA, listOf("p1", "p2"))
            it.setRolePermissions(roleB, listOf("p1", "p3"))
            it.ensureUserHasRole("test.user", roleGlobal, scopeId = "")
            it.ensureUserHasRole("test.user", roleA, scopeId = "idA")
            it.ensureUserHasRole("test.user", roleB, scopeId = "idB")
        } check { repo ->
            val roles = listOf(
                    ReifiedRole("a", Scope.Global()),
                    ReifiedRole("a", Scope.Specific("prefixA", "idA")),
                    ReifiedRole("b", Scope.Specific("prefixB", "idB"))
            )
            val permissions = listOf(
                    ReifiedPermission("p1", Scope.Global()),
                    ReifiedPermission("p1", Scope.Specific("prefixA", "idA")),
                    ReifiedPermission("p2", Scope.Specific("prefixA", "idA")),
                    ReifiedPermission("p1", Scope.Specific("prefixB", "idB")),
                    ReifiedPermission("p3", Scope.Specific("prefixB", "idB"))
            )
            checkUser(getUser(repo, email), roles, permissions)
        }
    }

    private fun checkUser(
            user: MontaguUser,
            expectedRoles: List<ReifiedRole> = emptyList(),
            expectedPermissions: List<ReifiedPermission> = emptyList())
    {
        assertThat(user.username).isEqualTo("test.user")
        assertThat(user.name).isEqualTo("Test User")
        assertThat(user.email).isEqualTo("test@example.com")
        assertThat(user.roles).hasSameElementsAs(expectedRoles)
        assertThat(user.permissions).hasSameElementsAs(expectedPermissions)
    }

    private fun getUser(repository: UserRepository, email: String): MontaguUser
    {
        val user = repository.getUserByEmail(email)
        assertThat(user).isNotNull()
        return user!!
    }

    private fun createPermissions(db: JooqContext, permissions: List<String>)
    {
        val records = permissions.map {
            db.dsl.newRecord(Tables.PERMISSION).apply { name = it }
        }
        db.dsl.batchStore(records).execute()
    }
}