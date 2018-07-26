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
import org.vaccineimpact.api.serialization.EmptyDataTable
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

    fun getTemplate(): StreamSerializable<BurdenEstimateRow>
    {
        val path = ExpectationPath(context)
        val type = context.queryParams("type") ?: "central"
        val expectationMapping = expectationsLogic.getExpectationsById(path.expectationId, path.groupId,
                path.touchstoneVersionId)

        context.addAttachmentHeader(getTemplateName(type, path, expectationMapping))

        val expectations = expectationMapping.expectation
        val rowCount = expectations.expectedRows().count()
        return if (type == "central")
        {
            EmptyDataTable.new<BurdenEstimate>(rowCount, expectations.outcomes)
        }
        else
        {
            EmptyDataTable.new<StochasticBurdenEstimate>(rowCount, expectations.outcomes)
        }

    }

    private fun getTemplateName(type: String, path: ExpectationPath, expectationMapping: ExpectationMapping): String
    {
        val nameParts = listOf(
                "$type-burden-template",
                path.touchstoneVersionId,
                path.groupId,
                *expectationMapping.applicableScenarios.toTypedArray(),
                "csv"
        )
        return nameParts.joinToString(".")
    }

    // We are sure that this will be non-null, as its part of the URL,
    // and Spark wouldn't have mapped us here if it were blank
    private fun groupId(context: ActionContext): String = context.params(":group-id")
}