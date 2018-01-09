package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.helpers.OneTimeAction

class NewStyleOneTimeLinkController(
        context: ActionContext,
        private val oneTimeTokenGenerator: OneTimeTokenGenerator)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, OneTimeTokenGenerator(repositories.token))

    fun getTokenForDemographicData(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY, context)
    }

    fun getTokenForCoverageData(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.COVERAGE, context)
    }

    fun getTokenForModelRunParameters(): String
    {
        return oneTimeTokenGenerator.getOneTimeLinkToken(OneTimeAction.MODEl_RUN_PARAMETERS, context)
    }
}