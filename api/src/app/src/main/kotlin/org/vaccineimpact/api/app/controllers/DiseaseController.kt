package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease
import spark.Request
import spark.Response

class DiseaseController(val db: () -> SimpleObjectsRepository) : AbstractController()
{
    override val urlComponent = "/diseases"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getDiseases, emptyList()),
            SecuredEndpoint("/:id/", this::getDisease, emptyList())
    )

    fun getDiseases(request: Request, response: Response): List<Disease>
    {
        return db().use { it.diseases.all() }.toList()
    }

    fun getDisease(request: Request, response: Response): Disease
    {
        return db().use { it.diseases.get(diseaseId(request)) }
    }

    private fun diseaseId(req: Request): String = req.params(":id")
}