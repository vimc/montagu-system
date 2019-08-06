package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.ResearchModelDetails

interface ModelRepository : Repository
{
    fun all(): List<ResearchModelDetails>
    fun get(id: String): ResearchModelDetails
}