package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.StreamSerializable
import java.time.Instant

open class BurdenEstimatesController(
        context: ActionContext,
        private val estimatesLogic: BurdenEstimateLogic,
        private val estimateRepository: BurdenEstimateRepository
) : BaseBurdenEstimateController(context, estimatesLogic)
{
    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            RepositoriesBurdenEstimateLogic(repos.modellingGroup, repos.burdenEstimates, repos.expectations),
            repos.burdenEstimates)

    fun getBurdenEstimates(): List<BurdenEstimateSet>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        return estimateRepository.getBurdenEstimateSets(path.groupId, path.touchstoneVersionId, path.scenarioId)
    }

    fun getBurdenEstimateSet(): BurdenEstimateSet
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val burdenEstimateSetId = context.params(":set-id").toInt()
        return estimateRepository.getBurdenEstimateSet(path.groupId, path.touchstoneVersionId, path.scenarioId, burdenEstimateSetId)
    }

    fun createBurdenEstimateSet(): String
    {
        // First check if we're allowed to see this touchstoneVersion
        val path = getValidResponsibilityPath(context, estimateRepository)
        val properties = context.postData<CreateBurdenEstimateSet>()

        val id = estimateRepository.createBurdenEstimateSet(path.groupId, path.touchstoneVersionId, path.scenarioId,
                properties = properties,
                uploader = context.username!!,
                timestamp = Instant.now())

        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneVersionId}/${path.scenarioId}/estimate-sets/$id/"
        return objectCreation(context, url)
    }

    fun getEstimatesForOutcome(): BurdenEstimateDataSeries
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val groupBy = context.queryParams("groupBy")
        val grouping = if (groupBy == "year")
        {
            BurdenEstimateGrouping.YEAR
        }
        else
        {
            BurdenEstimateGrouping.AGE
        }
        return estimatesLogic.getEstimates(context.params(":set-id").toInt(),
                path.groupId, path.touchstoneVersionId,
                path.scenarioId, context.params(":outcome-code"), grouping)
    }

    fun clearBurdenEstimateSet(): String
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()
        estimateRepository.clearBurdenEstimateSet(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
        return okayResponse()
    }

    fun closeBurdenEstimateSet(): Result
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()
        return closeEstimateSetAndReturnMissingRowError(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
    }

    fun getBurdenEstimateSetData(): StreamSerializable<BurdenEstimate>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()
        return estimatesLogic.getBurdenEstimateData(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
    }

}