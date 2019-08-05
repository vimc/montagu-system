package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.models.ResearchModel

class ModelController(context: ActionContext,
                      private val modelRepository: ModelRepository) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.modelRepository)

    fun getModels(): List<ResearchModel>
    {
        return modelRepository.all().toList()
    }

    fun getModel(): ResearchModel
    {
        return modelRepository.get(modelId(context))
    }

    private fun modelId(context: ActionContext): String = context.params(":id")
}