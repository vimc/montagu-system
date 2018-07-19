package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.filterByPermission
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.responsibilities.ResponsibilitiesWithExpectations
import org.vaccineimpact.api.serialization.EmptyDataTable
import org.vaccineimpact.api.serialization.StreamSerializable

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
            RepositoriesExpectationsLogic(repositories.responsibilities,
                    repositories.expectations, repositories.modellingGroup, repositories.touchstone))

    fun getResponsibleTouchstones(): List<Touchstone>
    {
        val groupId = groupId(context)
        return modellingGroupRepo.getTouchstonesByGroupId(groupId).filterByPermission(context)
    }

    fun getResponsibilities(): ResponsibilitiesWithExpectations
    {
        val groupId = groupId(context)
        val touchstoneVersionId = context.params(":touchstone-version-id")
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        val (responsibilities, touchstoneStatus) = expectationsLogic.getResponsibilitySetWithExpectations(groupId, touchstoneVersionId, filterParameters)
        context.checkIsAllowedToSeeTouchstone(touchstoneVersionId, touchstoneStatus)
        return responsibilities
    }

    fun getResponsibility(): ResponsibilityDetails
    {
        val path = ResponsibilityPath(context)
        modellingGroupRepo.getModellingGroup(path.groupId)
        val data = expectationsLogic.getResponsibilityWithExpectations(path.groupId, path.touchstoneVersionId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, data.touchstoneVersion.status)
        return data
    }

    fun getTemplate(): StreamSerializable<Any?>
    {
        val path = ResponsibilityPath(context)
        modellingGroupRepo.getModellingGroup(path.groupId)
        val expectations = expectationsLogic.getExpectationsForResponsibility(path.groupId,
                path.touchstoneVersionId, path.scenarioId)

        return EmptyDataTable.new<BurdenEstimate>(expectations.expectedRows().count(), expectations.outcomes)
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}
