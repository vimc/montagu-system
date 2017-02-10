package uk.ac.imperial.vimc.demo.app.repositories.jooq

import uk.ac.imperial.vimc.demo.app.filters.JooqEqualityFilter
import uk.ac.imperial.vimc.demo.app.filters.JooqFilter
import uk.ac.imperial.vimc.demo.app.filters.JooqFilterSet
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables

class JooqScenarioFilter : JooqFilterSet<ScenarioFilterParameters>() {
    private val table = Tables.COVERAGE_SCENARIO_DESCRIPTION

    override val filters : Iterable<JooqFilter<ScenarioFilterParameters>>
        get() = listOf<JooqEqualityFilter<ScenarioFilterParameters, Any>>(
                JooqEqualityFilter(table.ID, { it.scenarioId }),
                JooqEqualityFilter(table.VACCINE, { it.vaccine }),
                JooqEqualityFilter(table.DISEASE, { it.disease }),
                JooqEqualityFilter(table.SCENARIO_TYPE, { it.scenarioType }),
                JooqEqualityFilter(table.VACCINATION_LEVEL, { it.vaccinationLevel })
        )
}