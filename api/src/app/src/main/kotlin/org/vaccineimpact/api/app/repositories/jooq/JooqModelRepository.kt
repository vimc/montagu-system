package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.jooq.Record
import org.jooq.SelectConditionStep
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Disease
import org.vaccineimpact.api.models.ModelVersion
import org.vaccineimpact.api.models.ResearchModelDetails

class JooqModelRepository(dsl: DSLContext) : JooqRepository(dsl), ModelRepository
{
    override fun all(): List<ResearchModelDetails>
    {
        val modelRecords = modelQuery()

        val currentVersionRecords = dsl.select(
                    *MODEL_VERSION.fields(),
                    *DISEASE.fields(),
                    *COUNTRY.fields())
                .from(MODEL_VERSION)
                .innerJoin(MODEL)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .joinPath(MODEL_VERSION, MODEL_VERSION_COUNTRY, COUNTRY, joinType = JoinType.LEFT_OUTER_JOIN)
                .joinPath(MODEL, DISEASE)

        val currentVersions = currentVersionRecords.groupBy { it[MODEL_VERSION.ID] }
                .mapValues {
                    val countries = it.value.mapNotNull { r ->
                        if (r[COUNTRY.ID] != null)
                        {
                            r.into(Country::class.java)
                        }
                        else
                        {
                            null
                        }
                    }

                    it.value.first().toModelVersionWithCountries(countries)
                }

        return modelRecords.map {
            val model = it.toModelWithDisease()

            if (it[MODEL.CURRENT_VERSION] != null)
            {
                model.currentVersion = currentVersions[it[MODEL.CURRENT_VERSION]]
            }
            model
        }
    }

    override fun get(id: String): ResearchModelDetails
    {
        val modelRecord = modelQuery()
                .and(MODEL.ID.eq(id))
                .singleOrNull()
                ?: throw UnknownObjectError(id, ResearchModelDetails::class)

        val model = modelRecord.toModelWithDisease()

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

    private fun Record.toModelWithDisease(): ResearchModelDetails
    {
        val model = this.into(ResearchModelDetails::class.java)
        model.disease = this.into(Disease::class.java)
        return model
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