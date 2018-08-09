package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ResultRedirector
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.checkAllValuesAreEqual
import org.vaccineimpact.api.app.context.*
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.requests.PostDataHelper
import org.vaccineimpact.api.app.requests.csvData
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstoneVersion
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Instant

open class GroupBurdenEstimatesController(
        context: ActionContext,
        private val repositories: Repositories,
        private val estimateRepository: BurdenEstimateRepository,
        private val postDataHelper: PostDataHelper = PostDataHelper(),
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair)
        ) : Controller(context)
{
    constructor(context: ActionContext, repos: Repositories)
            : this(context, repos, repos.burdenEstimates)

    fun getBurdenEstimates(): List<BurdenEstimateSet>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        return estimateRepository.getBurdenEstimateSets(path.groupId, path.touchstoneVersionId, path.scenarioId)
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

    fun populateBurdenEstimateSet() = populateBurdenEstimateSet(RequestBodySource(context))
    fun populateBurdenEstimateSetFromMultipartStream() = populateBurdenEstimateSet(MultipartStreamSource("file", context))

    fun populateBurdenEstimateSet(source: RequestDataSource): String
    {
        return ResultRedirector(tokenHelper, repositories).redirectIfRequested(context, "") { repos ->
            val estimateRepository = repos.burdenEstimates

            // First check if we're allowed to see this touchstoneVersion
            val path = getValidResponsibilityPath(context, estimateRepository)

            // Next, get the metadata that will enable us to interpret the CSV
            val setId = context.params(":set-id").toInt()
            val metadata = estimateRepository.getBurdenEstimateSet(setId)

            // Then add the burden estimates
            val data = getBurdenEstimateDataFromCSV(metadata, source)
            estimateRepository.populateBurdenEstimateSet(
                    setId,
                    path.groupId, path.touchstoneVersionId, path.scenarioId,
                    data
            )

            // Then, maybe close the burden estimate set
            val keepOpen = context.queryParams("keepOpen")?.toBoolean() ?: false
            if (!keepOpen)
            {
                estimateRepository.closeBurdenEstimateSet(setId,
                        path.groupId, path.touchstoneVersionId, path.scenarioId)
            }

            okayResponse()
        }
    }

    fun clearBurdenEstimateSet(): String
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()
        estimateRepository.clearBurdenEstimateSet(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
        return okayResponse()
    }

    fun closeBurdenEstimateSet(): String
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        val setId = context.params(":set-id").toInt()
        estimateRepository.closeBurdenEstimateSet(setId, path.groupId, path.touchstoneVersionId, path.scenarioId)
        return okayResponse()
    }

    private fun getBurdenEstimateDataFromCSV(
            metadata: BurdenEstimateSet,
            source: RequestDataSource
    ): Sequence<BurdenEstimateWithRunId>
    {
        val data = if (metadata.type.type == BurdenEstimateSetTypeCode.STOCHASTIC)
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
        return data.checkAllValuesAreEqual({ it.disease },
                InconsistentDataError("More than one value was present in the disease column")
        )
    }

    private fun getValidResponsibilityPath(
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