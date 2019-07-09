package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.ModelVersion

class JooqModelRepository(dsl: DSLContext) : JooqRepository(dsl), ModelRepository
{

    private fun modelQuery(): SelectJoinStep<*>
    {
        return dsl.select(
                MODEL.ID,
                MODEL.DESCRIPTION,
                MODEL.CITATION,
                MODEL.MODELLING_GROUP,
                MODEL.GENDER_SPECIFIC,
                GENDER.CODE.`as`("gender"),
                MODEL.CURRENT_VERSION)
                .fromJoinPath(MODEL, GENDER, joinType = JoinType.LEFT_OUTER_JOIN)

    }

    override fun all(): List<Model>
    {
        val modelRecords =  modelQuery()

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
        val modelRecord = modelQuery()
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