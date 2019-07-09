package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.jooq.DSLContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.MODEL
import org.vaccineimpact.api.db.Tables.MODEL_VERSION
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.ModelVersion

class JooqModelRepository(dsl: DSLContext) : JooqRepository(dsl), ModelRepository
{
    override fun all(): List<Model>
    {
        val modelRecords =  dsl.fetch(MODEL)

        val currentVersions = dsl.select(*MODEL_VERSION.fields())
                .from(MODEL_VERSION)
                .innerJoin(MODEL)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .fetch()
                .associate{ it[MODEL_VERSION.ID] to it.into(ModelVersion::class.java) }

        return modelRecords.map{
            val model = it.into(Model::class.java)
            model.currentVersion = currentVersions[it[MODEL.CURRENT_VERSION]]
            model
        }
    }

    override fun get(id: String): Model
    {
        val modelRecord = dsl.select()
                .from(MODEL)
                .where(MODEL.ID.eq(id))
                .singleOrNull()
                ?: throw UnknownObjectError(id, "model_id")

        val model = modelRecord.into(Model::class.java)

        val versionRecord = dsl.select()
                .from(MODEL_VERSION)
                .where(MODEL_VERSION.ID.eq(modelRecord[MODEL.CURRENT_VERSION]))
                .singleOrNull()

        model.currentVersion = versionRecord?.into(ModelVersion::class.java)

        return model
    }
}