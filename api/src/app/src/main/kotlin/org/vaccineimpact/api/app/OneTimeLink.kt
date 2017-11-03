package org.vaccineimpact.api.app

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.endpoints.stream
import org.vaccineimpact.api.app.repositories.RepositoryFactory

data class OneTimeLink(val action: OneTimeAction,
                       val payload: Map<String, String>,
                       val queryParams: Map<String, String>,
                       val username: String)
{
    fun perform(controllers: MontaguControllers, actionContext: ActionContext, repositoryFactory: RepositoryFactory): Any
    {
        val callback = getCallback(action, controllers, repositoryFactory)
        val context = OneTimeLinkActionContext(payload, queryParams, actionContext, username)
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
                    OneTimeAction.BURDENS -> controllers.modellingGroup.addBurdenEstimatesFromHTMLForm(context, repos.burdenEstimates)
                    OneTimeAction.COVERAGE -> stream(controllers.modellingGroup.getCoverageData(context, repos.modellingGroup), context)
                    OneTimeAction.DEMOGRAPHY -> stream(controllers.touchstone.getDemographicData(context, repos.touchstone), context)
                    OneTimeAction.SET_PASSWORD -> controllers.password.setPasswordForUser(context, repos.user, context.params("username"))
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
            val rawQueryParams = claims["query"]?.toString()
            val payload = parseParams(rawPayload)
            val username = claims["username"].toString()
            val queryParams = parseQueryParams(rawQueryParams)

            return OneTimeLink(action, payload, queryParams, username)
        }
    }
}