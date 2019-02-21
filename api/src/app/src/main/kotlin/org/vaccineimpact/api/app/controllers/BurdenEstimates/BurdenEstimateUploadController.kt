package org.vaccineimpact.api.app.controllers.BurdenEstimates

import org.vaccineimpact.api.app.ResultRedirector
import org.vaccineimpact.api.app.asResult
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestDataSource
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.app.requests.csvData
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper

class BurdenEstimateUploadController(context: ActionContext,
                                     private val repositories: Repositories,
                                     private val estimatesLogic: BurdenEstimateLogic,
                                     private val estimateRepository: BurdenEstimateRepository,
                                     private val postDataHelper: PostDataHelper = PostDataHelper(),
                                     private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair))
    : BaseBurdenEstimateController(context, estimatesLogic)
{
    constructor(context: ActionContext, repos: Repositories)
            : this(context,
            repos,
            RepositoriesBurdenEstimateLogic(repos.modellingGroup, repos.burdenEstimates, repos.expectations),
            repos.burdenEstimates)

    fun getUploadToken(): String
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()

        // Check that this is a central estimate set
        val metadata = estimateRepository.getBurdenEstimateSet(path.groupId,
                path.touchstoneVersionId,
                path.scenarioId,
                setId)

        if (metadata.isStochastic())
        {
            throw BadRequest("Stochastic estimate upload not supported")
        }

        return tokenHelper.generateUploadEstimatesToken(
                context.username!!,
                path.groupId,
                path.touchstoneVersionId,
                path.scenarioId,
                setId,
                context.params(":file-name"))
    }

    fun populateBurdenEstimateSet() = populateBurdenEstimateSet(RequestDataSource.fromContentType(context))
    fun populateBurdenEstimateSet(source: RequestDataSource): Result
    {
        return ResultRedirector(tokenHelper, repositories).redirectIfRequested(context, "".asResult()) { repos ->
            val estimateRepository = repos.burdenEstimates

            // First check if we're allowed to see this touchstoneVersion
            val path = getValidResponsibilityPath(context, estimateRepository)

            // Next, get the metadata that will enable us to interpret the CSV
            val setId = context.params(":set-id").toInt()
            val metadata = estimateRepository.getBurdenEstimateSet(path.groupId,
                    path.touchstoneVersionId,
                    path.scenarioId,
                    setId)

            // Then add the burden estimates
            val data = getBurdenEstimateDataFromCSV(metadata, source)
            estimatesLogic.populateBurdenEstimateSet(
                    setId,
                    path.groupId, path.touchstoneVersionId, path.scenarioId,
                    data
            )

            // Then, maybe close the burden estimate set
            val keepOpen = context.queryParams("keepOpen")?.toBoolean() ?: false
            if (!keepOpen)
            {
                closeEstimateSetAndReturnMissingRowError(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
            }
            else
            {
                okayResponse().asResult()
            }
        }
    }

    private fun getBurdenEstimateDataFromCSV(
            metadata: BurdenEstimateSet,
            source: RequestDataSource
    ): Sequence<BurdenEstimateWithRunId>
    {
        return if (metadata.type.type == BurdenEstimateSetTypeCode.STOCHASTIC)
        {
            postDataHelper.csvData<StochasticBurdenEstimate>(from = source).map {
                BurdenEstimateWithRunId(it)
            }
        }
        else
        {
            postDataHelper.csvData<BurdenEstimate>(from = source).map {
                BurdenEstimateWithRunId(it, runId = null)
            }
        }
    }

}