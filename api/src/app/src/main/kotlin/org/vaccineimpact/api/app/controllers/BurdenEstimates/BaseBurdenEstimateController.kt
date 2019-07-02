package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.getAllowableTouchstoneStatusList

abstract class BaseBurdenEstimateController(context: ActionContext,
                                            private val estimatesLogic: BurdenEstimateLogic) : Controller(context)
{

    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            RepositoriesBurdenEstimateLogic(repos.modellingGroup, repos.burdenEstimates, repos.expectations, repos.scenario,
                                                repos.touchstone))

    protected fun getValidResponsibilityPath(): ResponsibilityPath
    {
        val result = ResponsibilityPath(context)
        estimatesLogic.validateResponsibilityPath(
                result,
                context.getAllowableTouchstoneStatusList())
        return result
    }

}