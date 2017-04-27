package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.db.Tables.DISEASE
import org.vaccineimpact.api.db.tables.records.DiseaseRecord
import org.vaccineimpact.api.models.Disease
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqSimpleDataSet

class JooqSimpleObjectsRepository : JooqRepository(), SimpleObjectsRepository
{
    override val diseases = JooqSimpleDataSet.new(dsl, DISEASE, { it.ID }, this::mapDisease)

    fun mapDisease(record: DiseaseRecord) = Disease(
            record.id,
            record.name
    )
}