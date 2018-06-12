package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.isAllowedToSeeTouchstone
import org.vaccineimpact.api.models.Responsibilities
import org.vaccineimpact.api.models.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.TouchstoneVersion

class ResponsibilityController(
        context: ActionContext,
        private val modellingGroupRepo: ModellingGroupRepository,
        private val responsibilitiesRepo: ResponsibilitiesRepository
        ) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modellingGroup, repositories.responsibilities)

    fun getResponsibleTouchstones(): List<TouchstoneVersion>
    {
        val groupId = groupId(context)

        var touchstones = modellingGroupRepo.getTouchstonesByGroupId(groupId)
        touchstones = touchstones.filter { context.isAllowedToSeeTouchstone(it.status) }
        return touchstones
    }

    fun getResponsibilities(): Responsibilities
    {
        val groupId = groupId(context)
        val touchstoneVersionId = context.params(":touchstone-version-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)

        val data = responsibilitiesRepo
                .getResponsibilitiesForGroupAndTouchstone(groupId, touchstoneVersionId, filterParameters)
        context.checkIsAllowedToSeeTouchstone(touchstoneVersionId, data.touchstoneStatus)
        return data.responsibilities
    }

    fun getResponsibility(): ResponsibilityAndTouchstone
    {
        val path = ResponsibilityPath(context)
        val data = responsibilitiesRepo.getResponsibility(path.groupId, path.touchstoneVersionId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, data.touchstoneVersion.status)
        return data
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
