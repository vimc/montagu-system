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
            OneTimeAction.COVERAGE -> { context ->
                repos.modellingGroup().use {
                    controllers.modellingGroup.getCoverageData(context, it)
                }
            }
            OneTimeAction.DEMOGRAPHY -> { context ->
                repos.touchstone().use {
                    controllers.touchstone.getDemographicData(context, it)
                }
            }
            OneTimeAction.SET_PASSWORD -> { context ->
                repos.user().use {
                    controllers.password.setPasswordForUser(context, it, context.params("username"))
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