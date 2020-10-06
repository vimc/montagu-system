package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.simplejavamail.email.Email
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.asResult
import org.vaccineimpact.api.app.clients.CeleryClient
import org.vaccineimpact.api.app.clients.TaskQueueClient
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesResponsibilitiesLogic
import org.vaccineimpact.api.app.logic.ResponsibilitiesLogic
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.getAllowableTouchstoneStatusList
import org.vaccineimpact.api.models.Result

abstract class BaseBurdenEstimateController(context: ActionContext,
                                            private val estimatesLogic: BurdenEstimateLogic,
                                            private val responsibilitiesLogic: ResponsibilitiesLogic,
                                            private val taskQueueClient: TaskQueueClient = CeleryClient()) : Controller(context)
{

    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            RepositoriesBurdenEstimateLogic(repos),
            RepositoriesResponsibilitiesLogic(repos.modellingGroup, repos.scenario, repos.touchstone),
            CeleryClient())

    protected fun closeEstimateSetAndReturnMissingRowError(setId: Int,
                                                           groupId: String,
                                                           disease: String,
                                                           touchstoneVersionId: String,
                                                           scenarioId: String): Result
    {
        val uploaderEmail = context.userProfile!!.email
        return try
        {
            estimatesLogic.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
            taskQueueClient.runDiagnosticReport(groupId, disease, touchstoneVersionId, uploaderEmail)
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
        responsibilitiesLogic.validateResponsibilityPath(
                result,
                context.getAllowableTouchstoneStatusList())
        return result
    }

}
