package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.extensions.fieldsAsList
import org.vaccineimpact.api.models.Scenario
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.db.Tables.SCENARIO
import org.vaccineimpact.api.db.Tables.SCENARIO_DESCRIPTION

class JooqScenarioRepository : JooqRepository(), ScenarioRepository
{
    override fun getScenarios(ids: Iterable<String>): List<Scenario>
    {
        return dsl.select(SCENARIO_DESCRIPTION.fieldsAsList())
                .select(SCENARIO.TOUCHSTONE)
                .fromJoinPath(SCENARIO_DESCRIPTION, SCENARIO)
                .where(SCENARIO_DESCRIPTION.ID.`in`(ids.toList()))
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