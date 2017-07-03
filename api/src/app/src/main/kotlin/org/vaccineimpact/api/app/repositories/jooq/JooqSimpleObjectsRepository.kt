package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.SimpleObjectsRepository
import org.vaccineimpact.api.db.Tables.DISEASE
import org.vaccineimpact.api.db.Tables.MODEL
import org.vaccineimpact.api.db.tables.records.DiseaseRecord
import org.vaccineimpact.api.db.tables.records.ModelRecord
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.models.Model

class JooqSimpleObjectsRepository : JooqRepository(), SimpleObjectsRepository
{
    override val diseases = JooqSimpleDataSet.new(dsl, DISEASE, { it.ID }, this::mapDisease)

    private fun mapDisease(record: DiseaseRecord): Disease = record.into(Disease::class.java)

}