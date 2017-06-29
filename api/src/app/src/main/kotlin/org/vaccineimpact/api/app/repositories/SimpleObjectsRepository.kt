package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.Disease

interface SimpleObjectsRepository : Repository
{
    val diseases: SimpleDataSet<Disease, String>
    val models: SimpleDataSet<Model, String>
}