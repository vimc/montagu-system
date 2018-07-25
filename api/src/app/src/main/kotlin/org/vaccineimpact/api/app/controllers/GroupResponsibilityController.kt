package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.helpers.ExpectationPath
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.app.security.filterByPermission
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations
import org.vaccineimpact.api.serialization.NullToEmptyStringSerializer
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.StreamSerializable

class GroupResponsibilityController(
        context: ActionContext,
        private val modellingGroupRepo: ModellingGroupRepository,
        private val touchstoneRepo: TouchstoneRepository,
        private val expectationsLogic: ExpectationsLogic
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories): this(
            context,
            repositories.modellingGroup,
            repositories.touchstone,
            RepositoriesExpectationsLogic(repositories.responsibilities, repositories.expectations,
                    repositories.modellingGroup, repositories.touchstone)
    )

    fun getResponsibleTouchstones(): List<Touchstone>
    {
        val groupId = groupId(context)
        return modellingGroupRepo.getTouchstonesByGroupId(groupId).filterByPermission(context)
    }

    fun getResponsibilities(): ResponsibilitySetWithExpectations
    {
        val groupId = groupId(context)
        val touchstoneVersionId = context.params(":touchstone-version-id")
        val touchstone = touchstoneRepo.touchstoneVersions.get(touchstoneVersionId)
        context.checkIsAllowedToSeeTouchstone(touchstoneVersionId, touchstone.status)
        val filterParameters = ScenarioFilterParameters.fromContext(context)
        return expectationsLogic.getResponsibilitySetWithExpectations(groupId, touchstoneVersionId, filterParameters)
    }

    fun getResponsibility(): ResponsibilityDetails
    {
        val path = ResponsibilityPath(context)
        modellingGroupRepo.getModellingGroup(path.groupId)
        val data = expectationsLogic.getResponsibilityWithExpectations(path.groupId, path.touchstoneVersionId, path.scenarioId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneVersionId, data.touchstoneVersion.status)
        return data
    }

    fun getTemplate(): StreamSerializable<ExpectedRow>
    {
        val path = ExpectationPath(context)
        val type = context.queryParams("type") ?: "central"
        val expectations = expectationsLogic.getExpectationsById(path.expectationId, path.groupId,
                path.touchstoneVersionId)

        return if (type == "central")
        {
            FlexibleDataTable.new<ExpectedCentralRow>(expectations.expectedCentralRows("YF"),
                    expectations.outcomes, NullToEmptyStringSerializer.instance)
        }
        else
        {
            FlexibleDataTable.new<ExpectedStochasticRow>(expectations.expectedStochasticRows("YF"),
                    expectations.outcomes, NullToEmptyStringSerializer.instance)
        }

    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}