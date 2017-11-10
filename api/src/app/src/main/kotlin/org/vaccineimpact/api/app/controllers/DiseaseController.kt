package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease

class DiseaseController(context: ActionContext,
                        private val simpleObjectsRepository: SimpleObjectsRepository)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.simpleObjects)

    private val diseaseId: String = context.params(":id")

    fun getDiseases(): List<Disease>
    {
        return simpleObjectsRepository.diseases.all().toList()
    }

    fun getDisease(): Disease
    {
        return simpleObjectsRepository.diseases.get(diseaseId)
    }
}