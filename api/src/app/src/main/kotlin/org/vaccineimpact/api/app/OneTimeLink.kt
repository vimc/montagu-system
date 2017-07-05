package org.vaccineimpact.api.app

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.repositories.Repositories

data class OneTimeLink(val action: OneTimeAction, val payload: Map<String, String>)
{
    fun perform(controllers: MontaguControllers, actionContext: ActionContext, repos: Repositories): Any
    {
        val callback = getCallback(action, controllers, repos)
        val context = OneTimeLinkActionContext(payload, actionContext)
        return callback.invoke(context)
    }

    private fun getCallback(
            action: OneTimeAction,
            controllers: MontaguControllers,
            repos: Repositories
    ): (ActionContext) -> Any
    {
        return when (action)
        {
            OneTimeAction.COVERAGE -> {
                { c ->
                    repos.modellingGroup().use {
                        controllers.modellingGroup.getCoverageData(c, it)
                    }
                }
            }
        }
    }

    companion object
    {
        fun parseClaims(claims: Map<String, Any>): OneTimeLink
        {
            val rawAction = claims["action"].toString()
            val action = Deserializer().parseEnum<OneTimeAction>(rawAction)
            val rawPayload = claims["payload"].toString()
            val payload = rawPayload
                    .split('&')
                    .map { it.split('=') }
                    .associateBy({ it[0] }, { it[1] })
            return OneTimeLink(action, payload)
        }
    }
}