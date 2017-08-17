package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.models.Model

class ModelController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/models"
    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("/", this::getModels, repos.modelRepository).secured(setOf("*/models.read")),
            oneRepoEndpoint("/:id/", this::getModel, repos.modelRepository).secured(setOf("*/models.read"))
    )

    @Suppress("UNUSED_PARAMETER")
    fun getModels(context: ActionContext, repo: ModelRepository): List<Model>
    {
        return repo.all().toList()
    }

    fun getModel(context: ActionContext, repo: ModelRepository): Model
    {
        return repo.get(modelId(context))
    }

    private fun modelId(context: ActionContext): String = context.params(":id")
}