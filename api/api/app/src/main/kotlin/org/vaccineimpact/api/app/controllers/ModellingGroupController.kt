package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.models.Responsibilities
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import spark.Request
import spark.Response

class ModellingGroupController(private val db: () -> ModellingGroupRepository)
    : AbstractController()
{
    override val urlComponent = "/modelling-groups"

    override val endpoints = listOf(
            EndpointDefinition("/", this::getModellingGroups),
            EndpointDefinition("/:group-id/responsibilities/:touchstone-id/", this::getResponsibilities)
    )

    fun getModellingGroups(req: Request, res: Response): List<ModellingGroup>
    {
        return db().use { it.modellingGroups.all() }.toList()
    }

    fun getResponsibilities(req: Request, res: Response): Responsibilities
    {
        val groupId = groupId(req)
        val touchstoneId = req.params(":touchstone-id")
        val filterParameters = ScenarioFilterParameters.fromRequest(req)
        return db().use { it.getResponsibilities(groupId, touchstoneId, filterParameters) }
    }

    // We are sure that this will be non-null, as its part of the URL, and Spark wouldn't have mapped us here
    // if it were blank
    private fun groupId(req: Request): String = req.params(":group-id")
}
