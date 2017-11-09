package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.DirectActionContext
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease

class DiseaseController(context: ActionContext,
                        val repo: SimpleObjectsRepository) : Controller(context)
{

    @Suppress("UNUSED_PARAMETER")
    fun getDiseases(): List<Disease>
    {
        return repo.diseases.all().toList()
    }

    fun getDisease(): Disease
    {
        return repo.diseases.get(diseaseId(context))
    }

    private fun diseaseId(context: ActionContext): String = context.params(":id")
}