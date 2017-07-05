package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.RoleAssignment

class UserControllerTests : ControllerTests<UserController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = UserController(controllerContext)

    @Test
    fun `getUser returns user without roles`()
    {
        val userName = "test"
        val user = User("test", "test name", "test@test.com", null)

        val permissionSet = PermissionSet()

        val repo = mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn user
        }

        val context = mock<ActionContext> {
            on { params(":username") } doReturn userName
            on { permissions } doReturn permissionSet
        }

        val controller = UserController(mockControllerContext())
        assertThat(controller.getUser(context, repo)).isEqualToComparingFieldByField(user)
    }

    @Test
    fun `getUser returns user with all roles`()
    {
        val userName = "test"

        val user = User("test", "test name", "test@test.com", null)
        val expectedRoles = listOf(
                RoleAssignment("user", null, null),
                RoleAssignment("member", "modelling-group", "IC-Garske")
        )

        val permissionSet = PermissionSet("*/roles.read")

        val repo = mock<UserRepository> {
            on { getUserByUsername(userName) } doReturn user
            on { getRolesForUser(userName) } doReturn expectedRoles
        }

        val context = mock<ActionContext> {
            on { params(":username") } doReturn userName
            on { permissions } doReturn permissionSet
        }

        val controller = UserController(mockControllerContext())
        val actualRoles = controller.getUser(context, repo).roles
        assertThat(actualRoles).hasSameElementsAs(expectedRoles)
    }

    @Test
    fun `getUser returns user with specific scoped roles`()
    {
        val userName = "test"

        val user = User("test", "test name", "test@test.com", null)
        val roles = listOf(
                RoleAssignment("user", null, null),
                RoleAssignment("member", "modelling-group", "IC-Garske"),
                RoleAssignment("member", "modelling-group", "group2"),
                RoleAssignment("member", "foo", "IC:Garske")
        )

        val permissionSet = PermissionSet("modelling-group:IC-Garske/roles.read")

        val repo = mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn user
            on { this.getRolesForUser(userName) } doReturn roles
        }

        val context = mock<ActionContext> {
            on { params(":username") } doReturn userName
            on { permissions } doReturn permissionSet
        }

        val expectedRoles = listOf(RoleAssignment("member", "modelling-group", "IC-Garske"))

        val controller = UserController(mockControllerContext())
        val actualRoles = controller.getUser(context, repo).roles

        assertThat(actualRoles).hasSameElementsAs(expectedRoles)
    }

    @Test
    fun `getUsers returns all users without roles`()
    {
        val users = listOf(User("test1", "Test Name 1   ", "test1@test.com", null))

        val repo = mock<UserRepository> {
            on { this.all() } doReturn users
        }

        val context = mock<ActionContext> {
            on { permissions } doReturn PermissionSet()
        }

        val controller = UserController(mockControllerContext())
        val actualUsers = controller.getUsers(context, repo)

        assertThat(actualUsers).hasSameElementsAs(users)
    }

    @Test
    fun `getUsers returns all users with all roles`()
    {
        val expectedRoles = listOf(
                RoleAssignment("user", null, null),
                RoleAssignment("member", "modelling-group", "IC-Garske")
        )

        val users = listOf(User("test", "test name", "test@test.com", null, expectedRoles))
        val permissionSet = PermissionSet("*/roles.read")

        val repo = mock<UserRepository> {
            on { allWithRoles() } doReturn users
        }

        val context = mock<ActionContext> {
            on { permissions } doReturn permissionSet
        }

        val controller = UserController(mockControllerContext())
        val actualRoles = controller.getUsers(context, repo)[0].roles
        assertThat(actualRoles).hasSameElementsAs(expectedRoles)
    }

    @Test
    fun `getUsers returns all users with specific scoped roles`()
    {
        val users = listOf(User("test", "test name", "test@test.com", null,
                listOf(
                        RoleAssignment("user", null, null),
                        RoleAssignment("member", "modelling-group", "IC-Garske"),
                        RoleAssignment("member", "modelling-group", "group2"),
                        RoleAssignment("member", "foo", "IC:Garske")
                )))

        val permissionSet = PermissionSet("modelling-group:IC-Garske/roles.read")

        val repo = mock<UserRepository> {
            on { this.allWithRoles() } doReturn users
        }

        val context = mock<ActionContext> {
            on { permissions } doReturn permissionSet
        }

        val expectedRoles = listOf(RoleAssignment("member", "modelling-group", "IC-Garske"))

        val controller = UserController(mockControllerContext())
        val actualRoles = controller.getUsers(context, repo)[0].roles

        assertThat(actualRoles).hasSameElementsAs(expectedRoles)
    }
}
