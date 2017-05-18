package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease

class DiseaseController(val db: () -> SimpleObjectsRepository) : AbstractController()
{
    override val urlComponent = "/diseases"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getDiseases, emptySet()),
            SecuredEndpoint("/:id/", this::getDisease, emptySet())
    )

    fun getDiseases(context: ActionContext): List<Disease>
    {
        return db().use { it.diseases.all() }.toList()
    }

    fun getDisease(context: ActionContext): Disease
    {
        return db().use { it.diseases.get(diseaseId(context)) }
    }

    private fun diseaseId(context: ActionContext): String = context.params(":id")
}