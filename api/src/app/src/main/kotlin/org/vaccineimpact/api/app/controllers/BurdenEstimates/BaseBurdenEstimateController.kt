package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.getAllowableTouchstoneStatusList
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.app.asResult

abstract class BaseBurdenEstimateController(context: ActionContext,
                                            private val estimatesLogic: BurdenEstimateLogic) : Controller(context)
{

    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            RepositoriesBurdenEstimateLogic(repos))

    protected fun closeEstimateSetAndReturnMissingRowError(setId: Int, groupId: String, touchstoneVersionId: String,
                                                           scenarioId: String): Result
    {
        return try
        {
            estimatesLogic.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
            okayResponse().asResult()
        }
        catch (error: MissingRowsError)
        {
            context.setResponseStatus(400)
            error.asResult()
        }
    }

    protected fun getValidResponsibilityPath(): ResponsibilityPath
    {
        val result = ResponsibilityPath(context)
        estimatesLogic.validateResponsibilityPath(
                result,
                context.getAllowableTouchstoneStatusList())
        return result
    }

}