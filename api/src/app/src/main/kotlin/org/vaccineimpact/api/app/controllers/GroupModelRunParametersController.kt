package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.app.security.checkIsAllowedToSeeTouchstone
import org.vaccineimpact.api.models.ModelRun
import org.vaccineimpact.api.models.ModelRunParameterSet
import org.vaccineimpact.api.serialization.FlexibleDataTable
import org.vaccineimpact.api.serialization.StreamSerializable
import java.time.Instant

class GroupModelRunParametersController(
        context: ActionContext,
        private val estimateRepository: BurdenEstimateRepository,
        private val modellingGroupRepository: ModellingGroupRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.burdenEstimates, repositories.modellingGroup)

    fun getModelRunParameterSets(): List<ModelRunParameterSet>
    {
        val touchstoneId = context.params(":touchstone-id")
        val groupId = context.params(":group-id")
        context.checkEstimatePermissionsForTouchstone(groupId, touchstoneId, estimateRepository)
        return estimateRepository.getModelRunParameterSets(groupId, touchstoneId)
    }

    fun addModelRunParameters(): String
    {
        val touchstoneId = context.params(":touchstone-id")
        val groupId = context.params(":group-id")
        context.checkEstimatePermissionsForTouchstone(groupId, touchstoneId, estimateRepository)

        val parts = context.getParts()
        val disease = parts["disease"]
        val description = parts["description"]
        val modelRuns = context.csvData<ModelRun>(parts["file"])

        val id = estimateRepository.addModelRunParameterSet(groupId, touchstoneId, disease,
                description, modelRuns.toList(), context.username!!, Instant.now())

        return objectCreation(context, "/modelling-groups/$groupId/model-run-parameters/$id/")
    }

    fun getModelRunParameterSet(): StreamSerializable<ModelRun>
    {
        val setId = context.params(":model-run-parameter-set-id")
        val data = getModelRunParametersAndMetadata()
        val filename = "set_$setId.csv"
        context.addAttachmentHeader(filename)
        return data
    }


    private fun getModelRunParametersAndMetadata():
            FlexibleDataTable<ModelRun>
    {
        val path = ModelRunParametersSetPath(context)
        val touchstone = modellingGroupRepository.getTouchstone(path.touchstoneId)
        context.checkIsAllowedToSeeTouchstone(touchstone.id, touchstone.status)
        return estimateRepository.getModelRunParametersData(path.setId)
    }

    // path parameters for model run parameters by set
    data class ModelRunParametersSetPath(val touchstoneId: String, val setId: Int)
    {
        constructor(context: ActionContext)
                : this(context.params(":touchstone-id"), context.params(":model-run-parameter-set-id").toInt())

    }
}