package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.logic.RepositoriesUserLogic
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleInternalUser

class UserLogicTests : MontaguTests()
{
    @Test
    fun `getUserByUsername passes through to repository`()
    {
        val repo = mock<UserRepository>()
        val sut = RepositoriesUserLogic(repo, mock())
        sut.getUserByUsername("user")
        verify(repo).getUserByUsername("user")
    }

    @Test
    fun `logInAndGetToken gets token and updates last logged in`()
    {
        val repo = mock<UserRepository>()
        val tokenHelper = mock<WebTokenHelper> {
            on { generateToken(any(), anyOrNull()) } doReturn "TOKEN"
        }
        val user = exampleInternalUser(username = "user")
        val sut = RepositoriesUserLogic(repo, tokenHelper)
        assertThat(sut.logInAndGetToken(user)).isEqualTo("TOKEN")
        verify(repo).updateLastLoggedIn("user")
    }
}
