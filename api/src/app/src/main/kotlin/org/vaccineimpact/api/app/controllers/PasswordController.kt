package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.models.SetPassword
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.UserRepository

open class PasswordController(
        context: ActionContext,
        val userRepository: UserRepository
) : Controller(context)
{

    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.user)

    fun setPassword(): String
    {
        return setPasswordForUser(context.username!!)
    }

    @Throws(Exception::class)
    open fun setPasswordForUser(username: String): String
    {
        val password = context.postData<SetPassword>().password
        userRepository.setPassword(username, password)
        return okayResponse()
    }
}