package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.ModelVersionRecord
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Model
import org.vaccineimpact.api.models.ModelVersion

class JooqModelRepository(dsl: DSLContext) : JooqRepository(dsl), ModelRepository
{
    override fun all(): List<Model>
    {
        val modelRecords =  modelQuery()

        val currentVersionRecords = dsl.select(*MODEL_VERSION.fields(),*COUNTRY.fields())
                .from(MODEL_VERSION)
                .innerJoin(MODEL)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .joinPath(MODEL_VERSION, MODEL_VERSION_COUNTRY, COUNTRY, joinType=JoinType.LEFT_OUTER_JOIN)


        val currentVersions = currentVersionRecords.groupBy{it[MODEL_VERSION.ID]}
                .mapValues{
                    val countries =  it.value.mapNotNull{r ->
                        if (r[COUNTRY.ID] != null)
                            r.into(Country::class.java)
                        else
                            null
                    }

                    it.value.first().toModelVersionWithCountries(countries)
                }

        return modelRecords.map{
            val model = it.into(Model::class.java)
            if (it[MODEL.CURRENT_VERSION] != null)
                model.currentVersion = currentVersions[it[MODEL.CURRENT_VERSION]]
            model
        }
    }

    override fun get(id: String): Model
    {
        val modelRecord = modelQuery()
                .and(MODEL.ID.eq(id))
                .singleOrNull()
                ?: throw UnknownObjectError(id, Model::class)

        val model = modelRecord.into(Model::class.java)

        val versionRecord = dsl.select()
                .from(MODEL_VERSION)
                .where(MODEL_VERSION.ID.eq(modelRecord[MODEL.CURRENT_VERSION]))
                .singleOrNull()

        if (versionRecord != null)
        {
            val countries = dsl.select(*COUNTRY.fields())
                    .fromJoinPath(MODEL_VERSION_COUNTRY, COUNTRY)
                    .where(MODEL_VERSION_COUNTRY.MODEL_VERSION.eq(modelRecord[MODEL.CURRENT_VERSION]))
                    .map { it.into(Country::class.java) }

            model.currentVersion = versionRecord.toModelVersionWithCountries(countries)
        }

        return model
    }

    private fun modelQuery(): SelectConditionStep<*>
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
                .where(MODEL.IS_CURRENT.eq(true))
    }

    private fun Record.toModelVersionWithCountries(countries: List<Country>): ModelVersion
    {
        return ModelVersion(this[MODEL_VERSION.ID],
                this[MODEL_VERSION.MODEL],
                this[MODEL_VERSION.VERSION],
                this[MODEL_VERSION.NOTE],
                this[MODEL_VERSION.FINGERPRINT],
                this[MODEL_VERSION.IS_DYNAMIC],
                this[MODEL_VERSION.CODE],
                countries)
    }
}