package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.permissions.RoleAssignment
import org.vaccineimpact.api.security.*

class UserTests : RepositoryTests<UserRepository>()
{
    val username = "test.user"
    val email = "test@example.com"
    override fun makeRepository(db: JooqContext) = JooqUserRepository(db)

    private fun addTestUser(db: JooqContext)
    {
        UserHelper.saveUser(db.dsl, username, "Test User", email, "password")
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
            assertThat(repo.getMontaguUserByEmail(username)).isNull()
            assertThat(repo.getMontaguUserByEmail("Test User")).isNull()
        }
    }

    @Test
    fun `can retrieve user with any case username`()
    {
        given(this::addTestUser).check { repo ->
            repo.getUserByUsername("test.user")
            repo.getUserByUsername("Test.User")
        }

    }

    @Test
    fun `throws unknown object error for incorrect username`()
    {
        given(this::addTestUser).check { repo ->
            assertThatThrownBy { repo.getUserByUsername("Test User") }
                    .isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `can retrieve all users`()
    {
        given({
            UserHelper.saveUser(it.dsl, "testuser", "Test User", "test1@test.com", "password")
            UserHelper.saveUser(it.dsl, "testuser2", "Test User 2", "test2@test.com", "password")
        }).check { repo ->
            val expectedUser = User("testuser", "Test User", "test1@test.com", null)
            val results = repo.all().toList()

            assertThat(results.count()).isEqualTo(2)
            assertThat(results[0]).isEqualToComparingFieldByField(expectedUser)
        }
    }

    @Test
    fun `can retrieve roles for user`()
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
                    RoleAssignment("role", null, null),
                    RoleAssignment("a", "prefixA", "idA"),
                    RoleAssignment("b", "prefixB", "idB")
            )
            assertThat(repo.getRolesForUser("test.user")).hasSameElementsAs(expectedRoles)
        }
    }

    @Test
    fun `can retrieve all users with roles`()
    {
        given({
            UserHelper.saveUser(it.dsl, "testuser1", "Test User", "test1@test.com", "password")
            UserHelper.saveUser(it.dsl, "testuser2", "Test User 2", "test2@test.com", "password")
            val roleGlobal = it.createRole("role", scopePrefix = null, description = "Role Global")
            val roleA = it.createRole("a", scopePrefix = "prefixA", description = "Role A")
            val roleB = it.createRole("b", scopePrefix = "prefixB", description = "Role B")
            it.ensureUserHasRole("testuser1", roleGlobal, scopeId = "")
            it.ensureUserHasRole("testuser1", roleA, scopeId = "idA")
            it.ensureUserHasRole("testuser2", roleB, scopeId = "idB")

        }).check { repo ->

            val expectedRoles1 = listOf(
                    RoleAssignment("role", null, null),
                    RoleAssignment("a", "prefixA","idA"))

            val expectedUser = User(
                    "testuser1", "Test User", "test1@test.com",
                    null, expectedRoles1)

            val expectedRoles2 = listOf(
                    RoleAssignment("b", "prefixB", "idB"))

            val expectedUser2 =  User(
                    "testuser2", "Test User 2", "test2@test.com",
                    null, expectedRoles2)

            val results = repo.allWithRoles()

            assertThat(results.count()).isEqualTo(2)

            checkUserWithRoles(results[0], expectedUser, expectedRoles1)
            checkUserWithRoles(results[1], expectedUser2, expectedRoles2)

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

    @Test
    fun `can add user`()
    {
        givenABlankDatabase() makeTheseChanges { repo ->
            repo.addUser(CreateUser("user.name", "Full Name", "email@example.com"))
        } andCheck { repo ->
            assertThat(repo.getUserByUsername("user.name")).isEqualTo(
                    User("user.name", "Full Name", "email@example.com", null)
            )
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

    private fun checkUserWithRoles(
            actualUser: User,
            expectedUser: User,
            expectedRoles: List<RoleAssignment>)
    {
        assertThat(actualUser.username).isEqualTo(expectedUser.username)
        assertThat(actualUser.name).isEqualTo(expectedUser.name)
        assertThat(actualUser.email).isEqualTo(expectedUser.email)
        assertThat(actualUser.roles).hasSameElementsAs(expectedRoles)
    }

    private fun getUser(repository: UserRepository, email: String): MontaguUser
    {
        val user = repository.getMontaguUserByEmail(email)
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