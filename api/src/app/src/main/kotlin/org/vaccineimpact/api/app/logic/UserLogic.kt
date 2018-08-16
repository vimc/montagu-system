package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.WebTokenHelper

interface UserLogic
{
    fun getUserByUsername(username: String): InternalUser
    fun logInAndGetToken(user: InternalUser): String
}

class RepositoriesUserLogic(
        private val repo: UserRepository,
        private val tokenHelper: WebTokenHelper
): UserLogic
{
    override fun getUserByUsername(username: String) = repo.getUserByUsername(username)

    override fun logInAndGetToken(user: InternalUser): String
    {
        repo.updateLastLoggedIn(user.username)
        return tokenHelper.generateToken(user)
    }
}
