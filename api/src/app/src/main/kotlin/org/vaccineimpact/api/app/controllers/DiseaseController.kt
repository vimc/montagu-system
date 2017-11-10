package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease

class DiseaseController(context: ActionContext,
                        private val simpleObjectsRepository: SimpleObjectsRepository) : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.simpleObjects)

    @Suppress("UNUSED_PARAMETER")
    fun getDiseases(): List<Disease>
    {
        return simpleObjectsRepository.diseases.all().toList()
    }

    fun getDisease(): Disease
    {
        return simpleObjectsRepository.diseases.get(diseaseId(context))
    }

    private fun diseaseId(context: ActionContext): String = context.params(":id")
}