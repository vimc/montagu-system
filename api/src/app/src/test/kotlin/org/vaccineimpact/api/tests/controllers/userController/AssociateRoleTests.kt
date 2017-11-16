package org.vaccineimpact.api.tests.controllers.userController

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class AssociateRoleTests : UserControllerTests()
{
    private val userName = "test.user"

    @Test
    fun `throws required permission error if no role writing permission`()
    {
        val mockUserRepo = mock<UserRepository>()

        val mockControllerContext = mockControllerContext()
        val controller = UserController(mockControllerContext)

        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet()
        }

        assertThatThrownBy {
            controller.modifyUserRole(mockActionContext, mockUserRepo)
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `throws required permission error if role writing permission is scoped to different scope`()
    {
        val mockUserRepo = mock<UserRepository>()

        val mockControllerContext = mockControllerContext()
        val controller = UserController(mockControllerContext)

        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:Someone-Else"))))
        }

        assertThatThrownBy {
            controller.modifyUserRole(mockActionContext, mockUserRepo)
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `throws required permission error if role writing permission is scoped and role is global`()
    {
        val mockUserRepo = mock<UserRepository>()

        val mockControllerContext = mockControllerContext()
        val controller = UserController(mockControllerContext)

        val model = AssociateRole("add", "user", null, null)
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:IC-Garske"))))
        }

        assertThatThrownBy {
            controller.modifyUserRole(mockActionContext, mockUserRepo)
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `returns ok if modifies role`()
    {
        val mockUserRepo = mock<UserRepository>()

        val mockControllerContext = mockControllerContext()
        val controller = UserController(mockControllerContext)

        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:IC-Garske"))))
        }

        val result = controller.modifyUserRole(mockActionContext, mockUserRepo)
        assertThat(result).isEqualTo("OK")
    }

}