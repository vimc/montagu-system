package org.vaccineimpact.api.app

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.repositories.RepositoryFactory

data class OneTimeLink(val action: OneTimeAction,
                       val payload: Map<String, String>,
                       val queryParams: Map<String, String>)
{
    fun perform(controllers: MontaguControllers, actionContext: ActionContext, repositoryFactory: RepositoryFactory): Any
    {
        val callback = getCallback(action, controllers, repositoryFactory)
        val context = OneTimeLinkActionContext(payload, queryParams, actionContext)
        return callback.invoke(context)
    }

    private fun getCallback(
            action: OneTimeAction,
            controllers: MontaguControllers,
            repoFactory: RepositoryFactory
    ): (ActionContext) -> Any
    {
        return { context ->
            repoFactory.inTransaction { repos ->
                when (action)
                {
                    OneTimeAction.COVERAGE -> controllers.modellingGroup.getCoverageData(context, repos.modellingGroup)
                    OneTimeAction.DEMOGRAPHY -> controllers.touchstone.getDemographicData(context, repos.touchstone)
                    OneTimeAction.SET_PASSWORD -> controllers.password.setPasswordForUser(context, repos.user, context.params("username"))
                }
            }
        }
    }

    companion object
    {
        private fun parseParams(params: String): Map<String, String>
        {
            return params.split('&')
                    .map { it.split('=') }
                    .associateBy({ it[0] }, { it[1] })
        }

        fun parseClaims(claims: Map<String, Any>): OneTimeLink
        {
            val rawAction = claims["action"].toString()
            val action = Deserializer().parseEnum<OneTimeAction>(rawAction)
            val rawPayload = claims["payload"].toString()
            val rawQueryParams = claims["query"]?.toString()
            val payload = parseParams(rawPayload)

            val queryParams =
                    if (rawQueryParams == null || rawQueryParams == "")
                    {
                        mapOf()
                    }
                    else
                    {
                        parseParams(rawQueryParams)
                    }

            return OneTimeLink(action, payload, queryParams)
        }
    }
}