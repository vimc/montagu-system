package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.filters.JooqEqualityFilter
import org.vaccineimpact.api.app.filters.JooqFilter
import org.vaccineimpact.api.app.filters.JooqFilterSet
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.db.Tables

class JooqScenarioFilter : JooqFilterSet<ScenarioFilterParameters>()
{
    private val table = Tables.SCENARIO_DESCRIPTION

    override val filters: Iterable<JooqFilter<ScenarioFilterParameters>>
        get() = listOf<JooqEqualityFilter<ScenarioFilterParameters, Any>>(
                JooqEqualityFilter(table.ID, { it.scenarioId }),
                JooqEqualityFilter(table.DISEASE, { it.disease })
        )
}