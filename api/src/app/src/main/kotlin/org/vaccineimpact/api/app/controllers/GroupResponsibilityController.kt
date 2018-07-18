package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.filterByPermission
import org.vaccineimpact.api.models.Responsibilities
import org.vaccineimpact.api.models.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.Touchstone

class GroupResponsibilityController(
        context: ActionContext,
        private val modellingGroupRepo: ModellingGroupRepository,
        private val responsibilitiesRepo: ResponsibilitiesRepository,
        private val expectationsLogic: ExpectationsLogic
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modellingGroup,
            repositories.responsibilities,
            RepositoriesExpectationsLogic(repositories.responsibilities, repositories.expectations))

    fun getResponsibleTouchstones(): List<Touchstone>
    {
        val groupId = groupId(context)
        return modellingGroupRepo.getTouchstonesByGroupId(groupId).filterByPermission(context)
    }

    fun getResponsibilities(): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneVersionId = context.params(":touchstone-version-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        modellingGroupRepo.getModellingGroup(groupId)
        val data = responsibilitiesRepo
                .getResponsibilitiesForGroupAndTouchstone(groupId, touchstoneVersionId, filterParameters)
        context.checkIsAllowedToSeeTouchstone(touchstoneVersionId, data.touchstoneStatus)
        return data.responsibilities
    }

    fun getResponsibility(): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        modellingGroupRepo.getModellingGroup(path.groupId)
        val data = responsibilitiesRepo.getResponsibility(path.groupId, path.touchstoneVersionId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, data.touchstoneVersion.status)
        return data
    }

    fun getTemplate()
    {
        val path = ResponsibilityPath(context)
        modellingGroupRepo.getModellingGroup(path.groupId)
        val expectations = expectationsLogic.getExpectationsForResponsibility(path.groupId,
                path.touchstoneVersionId, path.scenarioId)
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
