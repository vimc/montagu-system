package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.PasswordController
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.repositories.UserRepository

class PasswordControllerTests : ControllerTests<PasswordController>()
{
    override fun makeController(controllerContext: ControllerContext): PasswordController
    {
        return PasswordController(controllerContext)
    }

    @Test
    fun `can set password`()
    {
        val repo = mock<UserRepository>()
        val model = SetPassword("new_password")
        val context = mock<ActionContext> {
            on { postData(SetPassword::class.java) } doReturn model
            on { username } doReturn "thisUser"
        }
        val controller = PasswordController(mockControllerContext())
        val response = controller.setPassword(context, repo)
        verify(repo).setPassword("thisUser", "new_password")
        Assertions.assertThat(response).isEqualTo("OK")
    }
}