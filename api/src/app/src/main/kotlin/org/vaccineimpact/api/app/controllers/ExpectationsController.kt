package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.models.expectations.TouchstoneModelExpectations

class ExpectationsController(context: ActionContext,
                        private val repo: ExpectationsRepository)
    : Controller(context)
{
    constructor(context: ActionContext, repositories: Repositories)
            : this(context, repositories.expectations)


    fun getAllExpectations(): List<TouchstoneModelExpectations>
    {
        return repo.getAllExpectations()
    }

}