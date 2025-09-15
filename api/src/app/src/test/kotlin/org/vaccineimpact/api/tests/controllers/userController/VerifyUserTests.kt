package org.vaccineimpact.api.tests.controllers.userController

import org.junit.Test
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.UserController
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.test_helpers.MontaguTests
import spark.Request

class VerifyUserTests : MontaguTests()
{
    @Test
    fun `verifyCurrentUser gets user and sets response headers`()
    {
        val userName = "test.user"
        val context = mock<ActionContext> {
            on { username } doReturn userName
        }

        val internalUser = InternalUser(UserProperties(userName, "Test User", "test.user@example.com", null, null), listOf(), listOf())

        val repo = mock<UserRepository> {
            on { this.getUserByUsername(userName) } doReturn internalUser
        }

        val sut = UserController(context, repo, mock(), mock(), mock())
        val result = sut.verifyCurrentUser()

        Assertions.assertThat(result).isEqualTo("OK")
        verify(context).addResponseHeader("X-Remote-User", userName)
        verify(context).addResponseHeader("X-Remote-Name", "Test User")
        verify(context).addResponseHeader("X-Remote-Email", "test.user@example.com")
    }
}