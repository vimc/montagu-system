package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.models.Scenario
import org.vaccineimpact.api.db.Tables.SCENARIO_DESCRIPTION

class JooqScenarioRepository
{
    companion object
    {
        fun mapScenario(input: Record): Scenario
        {
            val t = SCENARIO_DESCRIPTION
            return Scenario(
                    id = input[t.ID],
                    description = input[t.DESCRIPTION],
                    disease = input[t.DISEASE]
            )
        }
    }
}