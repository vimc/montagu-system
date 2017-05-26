package org.vaccineimpact.api.app

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.controllers.MontaguControllers

data class OneTimeLink(val action: OneTimeAction, val payload: Map<String, String>)
{
    fun perform(controllers: MontaguControllers, actionContext: ActionContext): Any
    {
        val callback = getCallback(action, controllers)
        val context = OneTimeLinkActionContext(payload, actionContext)
        return callback.invoke(context)
    }

    fun getCallback(action: OneTimeAction, controllers: MontaguControllers): (ActionContext) -> Any
    {
        return when (action)
        {
            OneTimeAction.COVERAGE -> controllers.modellingGroup::getCoverageData
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

    class OneTimeLinkActionContext(
            private val payload: Map<String, String>,
            context: ActionContext
    ) : ActionContext by context
    {
        override fun params() = payload

        override fun params(key: String): String {
            var keyWithColon = key
            if (!keyWithColon.startsWith(":"))
            {
                keyWithColon = ":" + keyWithColon
            }
            return payload[keyWithColon]!!
        }
    }
}