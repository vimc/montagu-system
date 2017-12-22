package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.checkAllValuesAreEqual
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.context.postData
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.helpers.OneTimeAction
import spark.route.HttpMethod
import java.time.Instant

open class GroupBurdenEstimatesController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/modelling-groups/:group-id/responsibilities/:touchstone-id/:scenario-id"
    private val groupScope = "modelling-group:<group-id>"

    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        return listOf(
                oneRepoEndpoint("/estimate-sets/", this::getBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.get)
                        .secured(permissions("read")),

                /** Deprecated **/
                oneRepoEndpoint("/estimates/", this::addBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(permissions("write")),

                oneRepoEndpoint("/estimates/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS) }, repos, { it.token })
                        .secured(permissions("write")),

                oneRepoEndpoint("/estimate-sets/", this::createBurdenEstimateSet, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(permissions("write")),

                oneRepoEndpoint("/estimate-sets/:set-id/", this::populateBurdenEstimateSet, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(permissions("write")),

                oneRepoEndpoint("/estimate-sets/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS_CREATE) }, repos, { it.token })
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read")),

                oneRepoEndpoint("/estimate-sets/:set-id/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS_POPULATE) }, repos, { it.token })
                        .secured(setOf("$groupScope/estimates.write", "$groupScope/responsibilities.read"))
        )
    }

    private fun permissions(readOrWrite: String) = setOf(
            "$groupScope/estimates.$readOrWrite",
            "$groupScope/responsibilities.read"
    )

    fun getBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): List<BurdenEstimateSet>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        return estimateRepository.getBurdenEstimateSets(path.groupId, path.touchstoneId, path.scenarioId)
    }

    open fun addBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository)
            = addBurdenEstimates(context, estimateRepository, RequestBodySource.Simple())

    fun createBurdenEstimateSet(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
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

    @Deprecated("Instead use createBurdenEstimateSet and then populateBurdenEstimateSet")
    open fun addBurdenEstimates(
            context: ActionContext,
            estimateRepository: BurdenEstimateRepository,
            source: RequestBodySource
    ): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>(from = source)
        return saveBurdenEstimates(data, estimateRepository, context, path)
    }

    fun populateBurdenEstimateSet(
            context: ActionContext,
            estimateRepository: BurdenEstimateRepository
    ): String = populateBurdenEstimateSet(context, estimateRepository, RequestBodySource.Simple())

    fun populateBurdenEstimateSet(
            context: ActionContext,
            estimateRepository: BurdenEstimateRepository,
            source: RequestBodySource
    ): String
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

    @Deprecated("Instead use createBurdenEstimateSet and then populateBurdenEstimateSet")
    private fun saveBurdenEstimates(data: Sequence<BurdenEstimate>,
                                    estimateRepository: BurdenEstimateRepository,
                                    context: ActionContext,
                                    path: ResponsibilityPath): String
    {
        val checkedData = data.checkAllValuesAreEqual({ it.disease },
                InconsistentDataError("More than one value was present in the disease column")
        )

        val id = estimateRepository.addBurdenEstimateSet(
                path.groupId, path.touchstoneId, path.scenarioId,
                checkedData,
                uploader = context.username!!,
                timestamp = Instant.now()
        )
        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
        return objectCreation(context, url)
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