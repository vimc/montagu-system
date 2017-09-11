package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.MODEL
import org.vaccineimpact.api.models.Model

class JooqModelRepository(db: JooqContext, config: Configuration) : JooqRepository(db, config), ModelRepository
{
    override fun all(): List<Model>
    {
        return dsl.fetch(MODEL).into(Model::class.java)
    }

    override fun get(id: String): Model
    {
        val model = dsl.select()
                .from(MODEL)
                .where(MODEL.ID.eq(id))
                .fetchAny()

        return model.into(Model::class.java)
                ?: throw UnknownObjectError(id, "model_id")
    }
}