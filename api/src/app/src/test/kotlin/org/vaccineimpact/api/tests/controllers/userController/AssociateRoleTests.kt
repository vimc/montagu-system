package org.vaccineimpact.api.tests.controllers.userController

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.errors.MissingRequiredPermissionError
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.test_helpers.MontaguTests

class AssociateRoleTests : MontaguTests()
{
    private val userName = "test.user"

    @Test
    fun `throws required permission error if no role writing permission`()
    {
        val mockUserRepo = mock<UserRepository>()
        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet()
        }

        val sut = UserController(mockActionContext, mockUserRepo)

        assertThatThrownBy {
            sut.modifyUserRole()
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `throws required permission error if role writing permission is scoped to different scope`()
    {
        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:Someone-Else"))))
        }

        val sut = UserController(mockActionContext, mock<UserRepository>())

        assertThatThrownBy {
            sut.modifyUserRole()
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `throws required permission error if role writing permission is scoped and role is global`()
    {
        val model = AssociateRole("add", "user", null, null)
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:IC-Garske"))))
        }

        val sut = UserController(mockActionContext, mock<UserRepository>())

        assertThatThrownBy {
            sut.modifyUserRole()
        }.isInstanceOf(MissingRequiredPermissionError::class.java)
    }

    @Test
    fun `returns ok if modifies role`()
    {
        val model = AssociateRole("add", "member", "modelling-group", "IC-Garske")
        val mockActionContext = mock<ActionContext> {
            on { postData(AssociateRole::class.java) } doReturn model
            on { params(":username") } doReturn userName
            on { permissions } doReturn PermissionSet(setOf(ReifiedPermission("roles.write",
                    Scope.parse("modelling-group:IC-Garske"))))
        }

        val sut = UserController(mockActionContext, mock<UserRepository>())

        val result = sut.modifyUserRole()
        assertThat(result).isEqualTo("OK")
    }

}