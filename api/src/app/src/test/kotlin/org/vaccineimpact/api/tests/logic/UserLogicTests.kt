package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.logic.RepositoriesUserLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleInternalUser

class UserLogicTests : MontaguTests()
{
    @Test
    fun `getUserByUsername passes through to repository`()
    {
        val repo = mock<UserRepository>()
        val sut = RepositoriesUserLogic(repo, mock(), mock())
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
        val sut = RepositoriesUserLogic(repo, mock(), tokenHelper)
        assertThat(sut.logInAndGetToken(user)).isEqualTo("TOKEN")
        verify(repo).updateLastLoggedIn("user")
    }

    @Test
    fun `can get diseases for user`()
    {
        val mockGroupRepo = mock<ModellingGroupRepository> {
            on { getDiseasesForModellingGroup(any()) } doReturn listOf("d1")
        }
        val exampleGroups = listOf("g1", "g2", "g3")
        val user = exampleInternalUser(username = "user")
                .copy(roles = exampleGroups.map { ReifiedRole("member", Scope.Specific("modelling-group", it)) })

        val sut = RepositoriesUserLogic(mock(), mockGroupRepo, mock())

        val result = sut.getDiseasesForUser(user)
        assertThat(result).containsExactly("d1")
        verify(mockGroupRepo).getDiseasesForModellingGroup("g1")
        verify(mockGroupRepo).getDiseasesForModellingGroup("g2")
        verify(mockGroupRepo).getDiseasesForModellingGroup("g3")
    }

    @Test
    fun `getDiseases for user returns empty list if no group membership`()
    {
        val user = exampleInternalUser(username = "user")
        val sut = RepositoriesUserLogic(mock(), mock(), mock())

        val result = sut.getDiseasesForUser(user)
        assertThat(result.any()).isFalse()
    }

    @Test
    fun `getDiseases for user returns empty list if groups have no diseases`()
    {
        val exampleGroups = listOf("g1", "g2", "g3")
        val user = exampleInternalUser(username = "user")
                .copy(roles = exampleGroups.map { ReifiedRole("member", Scope.Specific("modelling-group", it)) })

        val sut = RepositoriesUserLogic(mock(), mock(), mock())

        val result = sut.getDiseasesForUser(user)
        assertThat(result.any()).isFalse()
    }

}
