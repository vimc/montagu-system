package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.isAllowedToSeeTouchstone
import org.vaccineimpact.api.models.Responsibilities
import org.vaccineimpact.api.models.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.Touchstone

class ResponsibilityController(
        context: ActionContext,
        private val repo: ModellingGroupRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modellingGroup)

    fun getResponsibleTouchstones(): List<Touchstone>
    {
        val groupId = groupId(context)

        var touchstones = repo.getTouchstonesByGroupId(groupId)
        touchstones = touchstones.filter { context.isAllowedToSeeTouchstone(it.status) }
        return touchstones
    }

    fun getResponsibilities(): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneId = context.params(":touchstone-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        val data = repo.getResponsibilities(groupId, touchstoneId, filterParameters)
        context.checkIsAllowedToSeeTouchstone(touchstoneId, data.touchstoneStatus)
        return data.responsibilities
    }

    fun getResponsibility(): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        val data = repo.getResponsibility(path.groupId, path.touchstoneId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, data.touchstone.status)
        return data
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
