package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.ResearchModel

interface ModelRepository : Repository
{
    fun all(): List<ResearchModel>
    fun get(id: String): ResearchModel
}