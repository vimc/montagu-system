package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.WebTokenHelper

interface UserLogic
{
    fun getUserByUsername(username: String): InternalUser
    fun logInAndGetToken(user: InternalUser): String
    fun getDiseasesForUser(user: InternalUser): List<String>
}

class RepositoriesUserLogic(
        private val userRepository: UserRepository,
        private val modellingGroupRepository: ModellingGroupRepository,
        private val tokenHelper: WebTokenHelper
) : UserLogic
{
    override fun getUserByUsername(username: String) = userRepository.getUserByUsername(username)

    override fun logInAndGetToken(user: InternalUser): String
    {
        userRepository.updateLastLoggedIn(user.username)
        return tokenHelper.generateToken(user)
    }

    override fun getDiseasesForUser(user: InternalUser): List<String>
    {
        val userGroups = user.roles.filter { it.name == "member" }.map { it.scope.databaseScopeId }
        return userGroups.flatMap { modellingGroupRepository.getDiseasesForModellingGroup(it) }.distinct()
    }
}
