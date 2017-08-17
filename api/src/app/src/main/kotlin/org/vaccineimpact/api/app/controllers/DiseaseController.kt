package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.secured
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.models.Disease

class DiseaseController(context: ControllerContext) : AbstractController(context)
{
    override val urlComponent = "/diseases"
    override fun endpoints(repos: Repositories) = listOf(
            oneRepoEndpoint("/", this::getDiseases, repos.simpleObjects).secured(),
            oneRepoEndpoint("/:id/", this::getDisease, repos.simpleObjects).secured()
    )

    @Suppress("UNUSED_PARAMETER")
    fun getDiseases(context: ActionContext, repo: SimpleObjectsRepository): List<Disease>
    {
        return repo.diseases.all().toList()
    }

    fun getDisease(context: ActionContext, repo: SimpleObjectsRepository): Disease
    {
        return repo.diseases.get(diseaseId(context))
    }

    private fun diseaseId(context: ActionContext): String = context.params(":id")
}