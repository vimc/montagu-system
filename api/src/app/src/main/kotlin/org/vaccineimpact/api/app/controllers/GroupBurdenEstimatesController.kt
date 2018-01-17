package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.checkAllValuesAreEqual
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.models.*
import java.time.Instant

open class GroupBurdenEstimatesController(
        context: ActionContext,
        private val estimateRepository: BurdenEstimateRepository
) : Controller(context)
{
    constructor(context: ActionContext, repos: Repositories)
            : this(context, repos.burdenEstimates)

    fun getBurdenEstimates(): List<BurdenEstimateSet>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        return estimateRepository.getBurdenEstimateSets(path.groupId, path.touchstoneId, path.scenarioId)
    }

    fun createBurdenEstimateSet(): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)
        val properties = context.postData<CreateBurdenEstimateSet>()

        val id = estimateRepository.createBurdenEstimateSet(path.groupId, path.touchstoneId, path.scenarioId,
                properties = properties,
                uploader = context.username!!,
                timestamp = Instant.now())

        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
        return objectCreation(context, url)
    }

    fun populateBurdenEstimateSet(source: RequestBodySource = RequestBodySource.Simple()): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Next, get the metadata that will enable us to interpret the CSV
        val setId = context.params(":set-id").toInt()
        val metadata = estimateRepository.getBurdenEstimateSet(setId)

        // Then add the burden estimates
        val data = getBurdenEstimateDataFromCSV(metadata, context, source)
        estimateRepository.populateBurdenEstimateSet(
                setId,
                path.groupId, path.touchstoneId, path.scenarioId,
                data
        )

        return okayResponse()
    }

    private fun getBurdenEstimateDataFromCSV(
            metadata: BurdenEstimateSet, context: ActionContext, source: RequestBodySource
    ): Sequence<BurdenEstimateWithRunId>
    {
        val data = if (metadata.type.type == BurdenEstimateSetTypeCode.STOCHASTIC)
        {
            context.csvData<StochasticBurdenEstimate>(from = source).map {
                BurdenEstimateWithRunId(it)
            }
        }
        else
        {
            context.csvData<BurdenEstimate>(from = source).map {
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
        context.checkEstimatePermissionsForTouchstone(path.groupId, path.touchstoneId, estimateRepository, readEstimatesRequired)
        return path
    }

}