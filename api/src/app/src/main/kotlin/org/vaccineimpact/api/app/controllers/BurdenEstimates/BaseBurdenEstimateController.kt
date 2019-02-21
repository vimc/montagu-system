package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.asResult
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstoneVersion
import org.vaccineimpact.api.models.Result

abstract class BaseBurdenEstimateController(context: ActionContext,
                                            private val estimatesLogic: BurdenEstimateLogic) : Controller(context)
{

    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            RepositoriesBurdenEstimateLogic(repos.modellingGroup, repos.burdenEstimates, repos.expectations))

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

    protected fun getValidResponsibilityPath(
            context: ActionContext,
            estimateRepository: BurdenEstimateRepository,
            readEstimatesRequired: Boolean = false
    ): ResponsibilityPath
    {
        val path = ResponsibilityPath(context)
        context.checkEstimatePermissionsForTouchstoneVersion(path.groupId, path.touchstoneVersionId, estimateRepository, readEstimatesRequired)
        return path
    }

}