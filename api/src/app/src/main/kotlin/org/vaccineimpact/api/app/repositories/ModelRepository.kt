package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Model

interface ModelRepository : Repository
{
    fun all(): List<Model>
    fun get(id: String): Model
}