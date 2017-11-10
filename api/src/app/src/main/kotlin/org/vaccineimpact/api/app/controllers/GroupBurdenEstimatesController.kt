package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.EndpointDefinition
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.csvData
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.serialization.DataTableDeserializer
import spark.route.HttpMethod
import java.time.Instant
import javax.servlet.MultipartConfigElement

open class GroupBurdenEstimatesController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/modelling-groups/:group-id/responsibilities/:touchstone-id/:scenario-id/estimates"
    private val groupScope = "modelling-group:<group-id>"

    override fun endpoints(repos: RepositoryFactory): Iterable<EndpointDefinition<*>>
    {
        return listOf(
                oneRepoEndpoint("/", this::getBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.get)
                        .secured(permissions("read")),
                oneRepoEndpoint("/", this::addBurdenEstimates, repos, { it.burdenEstimates }, method = HttpMethod.post)
                        .secured(permissions("write")),
                oneRepoEndpoint("/get_onetime_link/", { c, r -> getOneTimeLinkToken(c, r, OneTimeAction.BURDENS) }, repos, { it.token })
                        .secured(permissions("write"))
        )
    }

    private fun permissions(readOrWrite: String) = setOf(
            "$groupScope/estimates.$readOrWrite",
            "$groupScope/responsibilities.read"
    )

    fun getBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): List<BurdenEstimateSet>
    {
        val path = getValidResponsibilityPath(context, estimateRepository)
        return estimateRepository.getBurdenEstimateSets(path.groupId, path.touchstoneId, path.scenarioId).toList()
    }

    fun addBurdenEstimatesFromHTMLForm(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        val request = context.request
        if (request.raw().getAttribute("org.eclipse.jetty.multipartConfig") == null)
        {
            val multipartConfigElement = MultipartConfigElement(System.getProperty("java.io.tmpdir"))
            request.raw().setAttribute("org.eclipse.jetty.multipartConfig", multipartConfigElement)
        }

        request.raw().getPart("file").inputStream.bufferedReader().use {

            // Then add the burden estimates
            val data = DataTableDeserializer.deserialize(it.readText(), BurdenEstimate::class,
                    serializer).toList()
            return saveBurdenEstimates(data, estimateRepository, context, path)
        }
    }

    open fun addBurdenEstimates(context: ActionContext, estimateRepository: BurdenEstimateRepository): String
    {
        // First check if we're allowed to see this touchstone
        val path = getValidResponsibilityPath(context, estimateRepository)

        // Then add the burden estimates
        val data = context.csvData<BurdenEstimate>()
        return saveBurdenEstimates(data, estimateRepository, context, path)
    }

    private fun saveBurdenEstimates(data: List<BurdenEstimate>,
                                    estimateRepository: BurdenEstimateRepository,
                                    context: ActionContext,
                                    path: ResponsibilityPath): String
    {
        if (data.map { it.disease }.distinct().count() > 1)
        {
            throw InconsistentDataError("More than one value was present in the disease column")
        }

        val id = estimateRepository.addBurdenEstimateSet(
                path.groupId, path.touchstoneId, path.scenarioId,
                data,
                uploader = context.username!!,
                timestamp = Instant.now()
        )
        val url = "/modelling-groups/${path.groupId}/responsibilities/${path.touchstoneId}/${path.scenarioId}/estimates/$id/"
        return objectCreation(context, url, useControllerURL = false)
    }

    private fun getValidResponsibilityPath(
            context: ActionContext,
            estimateRepository: BurdenEstimateRepository,
            readEstimatesRequired: Boolean = false
    ): ResponsibilityPath
    {
        val path = ResponsibilityPath(context)
        val touchstoneId = path.touchstoneId
        val touchstones = estimateRepository.touchstoneRepository.touchstones
        val touchstone = touchstones.get(touchstoneId)
        context.checkIsAllowedToSeeTouchstone(path.touchstoneId, touchstone.status)
        if (readEstimatesRequired)
        {
            if (touchstone.status == TouchstoneStatus.OPEN)
            {
                context.requirePermission(ReifiedPermission(
                        "estimates.read-unfinished",
                        Scope.Specific("modelling-group", path.groupId)
                ))
            }
        }
        return path
    }
}