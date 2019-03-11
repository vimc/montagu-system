package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.logic.RepositoriesModellingGroupLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.test_helpers.MontaguTests

class ModellingGroupLogicTests : MontaguTests()
{
    @Test
    fun `can get user modelling groups`()
    {
        val user = InternalUser(UserProperties("test-user", "Test User", "test@user.com",
                null, null),
                listOf(
                        ReifiedRole("member", Scope.Specific("modelling-group", "group-1")),
                        ReifiedRole("member", Scope.Specific("modelling-group", "group-2")),
                        ReifiedRole("some-other-role", Scope.Specific("modelling-group", "group-3")),
                        ReifiedRole("member", Scope.Global())
                ),
                listOf()
        )

        val userRepo = mock<UserRepository>{
            on (it.getUserByUsername("test-user")) doReturn user
        }

        val expectedResult = listOf(
                ModellingGroup("group-1", "first group"),
                ModellingGroup("group2", "second group")
        )
        val groupRepo = mock<ModellingGroupRepository>{
            on (it.getModellingGroups(arrayOf("group-1", "group-2"))) doReturn expectedResult
        }

        val sut = RepositoriesModellingGroupLogic(groupRepo, userRepo)

        val result = sut.getUserModellingGroups("test-user")

        verify(userRepo).getUserByUsername("test-user")
        Assertions.assertThat(result).isEqualTo(expectedResult)
    }

    @Test
    fun `can get empty modelling groups for user with no member roles`()
    {
        val user = InternalUser(UserProperties("test-user", "Test User", "test@user.com",
                null, null),
                listOf(
                        ReifiedRole("some-other-role", Scope.Specific("modelling-group", "group-3"))
                ),
                listOf()
        )

        val userRepo = mock<UserRepository>{
            on (it.getUserByUsername("test-user")) doReturn user
        }

        val groupRepo = mock<ModellingGroupRepository>{
            on (it.getModellingGroups(arrayOf())) doReturn listOf<ModellingGroup>()
        }

        val sut = RepositoriesModellingGroupLogic(groupRepo, userRepo)

        val result = sut.getUserModellingGroups("test-user")

        verify(userRepo).getUserByUsername("test-user")
        Assertions.assertThat(result).isEqualTo(listOf<ModellingGroup>())
    }
}