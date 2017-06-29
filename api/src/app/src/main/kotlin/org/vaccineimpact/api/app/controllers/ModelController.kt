package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.models.Model

class ModelController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/models"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getModels, setOf("*/models.read")),
            SecuredEndpoint("/:id/", this::getModel, setOf("*/models.read"))
    )

    fun getModels(context: ActionContext): List<Model>
    {
        return repos.simpleObjects().use { it.models.all() }.toList()
    }

    fun getModel(context: ActionContext): Model
    {
        return repos.simpleObjects().use { it.models.get(modelId(context)) }
    }

    private fun modelId(context: ActionContext): String = context.params(":id")
}