package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.security.WebTokenHelper

class DiseaseController(context: ActionContext,
                        private val simpleObjectsRepository: SimpleObjectsRepository)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories, webTokenHelper: WebTokenHelper)
            : this(context, repositories.simpleObjects)


    fun getDiseases(): List<Disease>
    {
        return simpleObjectsRepository.diseases.all().toList()
    }

    fun getDisease(): Disease
    {
        val diseaseId = context.params(":id")
        return simpleObjectsRepository.diseases.get(diseaseId)
    }
}