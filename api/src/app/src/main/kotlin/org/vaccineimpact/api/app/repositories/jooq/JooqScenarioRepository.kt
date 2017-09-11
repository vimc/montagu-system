package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.jooq.Record
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.SCENARIO
import org.vaccineimpact.api.db.Tables.SCENARIO_DESCRIPTION
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.models.Scenario

class JooqScenarioRepository(db: JooqContext, config: Configuration) : JooqRepository(db, config), ScenarioRepository
{
    override fun checkScenarioDescriptionExists(id: String)
    {
        if (!dsl.fetchExists(SCENARIO_DESCRIPTION, SCENARIO_DESCRIPTION.ID.eq(id)))
        {
            throw UnknownObjectError(id, "scenario-description")
        }
    }

    override fun getScenarios(descriptionIds: Iterable<String>): List<Scenario>
    {
        return dsl.select(SCENARIO_DESCRIPTION.fieldsAsList())
                .select(SCENARIO.TOUCHSTONE)
                .fromJoinPath(SCENARIO_DESCRIPTION, SCENARIO)
                .where(SCENARIO_DESCRIPTION.ID.`in`(descriptionIds.distinct().toList()))
                .fetch()
                .groupBy { it[SCENARIO_DESCRIPTION.ID] }
                .map { mapScenario(it.value) }
    }

    companion object
    {
        fun mapScenario(input: List<Record>): Scenario
        {
            val d = SCENARIO_DESCRIPTION
            val first = input.first()
            return Scenario(
                    id = first[d.ID],
                    description = first[d.DESCRIPTION],
                    disease = first[d.DISEASE],
                    touchstones = input.map { it[SCENARIO.TOUCHSTONE] }
            )
        }
    }
}

fun makeScenarioRepository(db: JooqContext) = JooqScenarioRepository(db, db.dsl.configuration())