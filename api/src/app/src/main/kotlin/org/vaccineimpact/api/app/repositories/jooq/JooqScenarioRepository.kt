package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.jooq.Record
import org.jooq.SelectConditionStep
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.MappingHelper
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.ScenarioDescription
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.Scenario

class JooqScenarioRepository(dsl: DSLContext,
                             private val mapper: MappingHelper = MappingHelper())
    : JooqRepository(dsl), ScenarioRepository
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
                .select(SCENARIO.TOUCHSTONE, COVERAGE_SET.ACTIVITY_TYPE)
                .fromJoinPath(SCENARIO_DESCRIPTION, SCENARIO)
                .leftJoin(COVERAGE_SET)
                .on(SCENARIO.FOCAL_COVERAGE_SET.eq(COVERAGE_SET.ID))
                .where(SCENARIO_DESCRIPTION.ID.`in`(descriptionIds.distinct().toList()))
                .fetch()
                .groupBy { it[SCENARIO_DESCRIPTION.ID] }
                .map { mapScenarioWithFocalActivityType(it.value) }
                .sortedWith(compareBy({ it.scenario.disease }, { it.activityType }))
                .map { it.scenario }

    }


    override fun getScenariosForTouchstone(touchstoneVersionId: String,
                                           scenarioFilterParameters: ScenarioFilterParameters): List<Scenario>
    {
        val scenarios = dsl.select(SCENARIO_DESCRIPTION.fieldsAsList())
                .select(SCENARIO.TOUCHSTONE, COVERAGE_SET.ACTIVITY_TYPE)
                .fromJoinPath(SCENARIO_DESCRIPTION, SCENARIO)
                .leftJoin(COVERAGE_SET)
                .on(SCENARIO.FOCAL_COVERAGE_SET.eq(COVERAGE_SET.ID))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetch()
                .groupBy { it[SCENARIO_DESCRIPTION.ID] }
                .map { mapScenarioWithFocalActivityType(it.value) }
                .sortedWith(compareBy({ it.scenario.disease }, { it.activityType }))
                .map { it.scenario }

        return scenarios.filter { it.touchstones.contains(touchstoneVersionId) }
    }

    override fun getScenarioForTouchstone(touchstoneVersionId: String,
                                          scenarioDescriptionId: String): Scenario
    {
        val scenarios = dsl.select(SCENARIO_DESCRIPTION.fieldsAsList())
                .select(SCENARIO.TOUCHSTONE)
                .fromJoinPath(SCENARIO_DESCRIPTION, SCENARIO)
                .where(SCENARIO.SCENARIO_DESCRIPTION.eq(scenarioDescriptionId))
                .fetch()

        val scenario = mapScenario(scenarios)

        if (!scenario.touchstones.contains(touchstoneVersionId))
            throw UnknownObjectError(scenarioDescriptionId, "scenario")

        return scenario
    }

    private fun mapScenarioWithFocalActivityType(input: List<Record>): ScenarioAndFocalActivityType
    {
        val first = input.first()
        val scenario = mapScenario(input)
        return ScenarioAndFocalActivityType(scenario,
                mapper.mapNullableEnum<ActivityType>(first[COVERAGE_SET.ACTIVITY_TYPE]))
    }

    data class ScenarioAndFocalActivityType(val scenario: Scenario, val activityType: ActivityType?)

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
                    touchstones = input.map { it[SCENARIO.TOUCHSTONE] }.sortedBy { it }
            )
        }
    }
}