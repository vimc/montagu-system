package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.controllers.*
import org.vaccineimpact.api.app.controllers.endpoints.stream
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.serialization.Deserializer


open class OnetimeLinkResolver(private val controllers: MontaguControllers,
                               private val repositoryFactory: RepositoryFactory,
                               private val webTokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair))
{

    @Throws(Exception::class)
    open fun perform(oneTimeLink: OneTimeLink, actionContext: ActionContext): Any
    {
        val callback = getCallback(oneTimeLink.action, controllers, repositoryFactory, webTokenHelper)
        val context = OneTimeLinkActionContext(oneTimeLink.payload, oneTimeLink.queryParams, actionContext, oneTimeLink.username)
        return callback.invoke(context)
    }

    private fun getCallback(
            action: OneTimeAction,
            controllers: MontaguControllers,
            repoFactory: RepositoryFactory,
            webTokenHelper: WebTokenHelper
    ): (ActionContext) -> Any
    {
        return { context ->
            repoFactory.inTransaction { repos ->
                when (action)
                {
                    OneTimeAction.BURDENS_CREATE -> controllers.groupBurdenEstimates.createBurdenEstimateSet(context, repos.burdenEstimates)
                    OneTimeAction.BURDENS_POPULATE -> controllers.groupBurdenEstimates.populateBurdenEstimateSet(
                            context,
                            repos.burdenEstimates,
                            RequestBodySource.HTMLMultipart("file")
                    )
                    OneTimeAction.MODEl_RUN_PARAMETERS -> stream(GroupModelRunParametersController(context, repos).getModelRunParameterSet(), context)
                    OneTimeAction.COVERAGE -> stream(GroupCoverageController(context, repos.modellingGroup).getCoverageData(), context)
                    OneTimeAction.DEMOGRAPHY -> stream(TouchstoneController(context, repos).getDemographicData(), context)
                    OneTimeAction.SET_PASSWORD -> PasswordController(context, repos.user, OneTimeTokenGenerator(repos.token, webTokenHelper)).setPasswordForUser(context.params("username"))
                }
            }
        }
    }
}

data class OneTimeLink(val action: OneTimeAction,
                       val payload: Map<String, String>,
                       val queryParams: Map<String, String>,
                       val username: String)
{

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
            val username = claims["username"].toString()
            val queryParams =
                    if (rawQueryParams == null || rawQueryParams == "")
                    {
                        mapOf()
                    }
                    else
                    {
                        parseParams(rawQueryParams)
                    }

            return OneTimeLink(action, payload, queryParams, username)
        }
    }
}