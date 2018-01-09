package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.csvData
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.security.checkEstimatePermissionsForTouchstone
import org.vaccineimpact.api.models.ModelRun
import org.vaccineimpact.api.models.ModelRunParameterSet
import java.time.Instant

class GroupModelRunParametersController(
        context: ActionContext,
        private val estimateRepository: BurdenEstimateRepository
) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.burdenEstimates)

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
}