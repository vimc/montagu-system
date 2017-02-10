package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.slf4j.LoggerFactory
import uk.ac.imperial.vimc.demo.app.extensions.toBigDecimal
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.CoverageScenarioDescriptionRecord
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.RoutineCoverageRecord
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository

@Suppress("unused")
class JooqScenarioRepository : JooqRepository(), ScenarioRepository {
    override val countries: DataSet<Country, String>
            get() = JooqDataSet.new(dsl, Tables.COUNTRY, Tables.COUNTRY.ID, { Country(it.id, it.name) })
    override val scenarios: DataSet<Scenario, String>
            get() = JooqDataSet.new(dsl, Tables.COVERAGE_SCENARIO_DESCRIPTION, Tables.COVERAGE_SCENARIO_DESCRIPTION.ID, this::scenarioMapper)

    override fun getScenarios(scenarioFilterParameters: ScenarioFilterParameters): Iterable<Scenario> {
        val table = Tables.COVERAGE_SCENARIO_DESCRIPTION
        val filterable = dsl.selectFrom(table).where()
        return JooqScenarioFilter()
                .apply(filterable, scenarioFilterParameters)
                .fetch()
                .map(this::scenarioMapper)
    }


    private val logger = LoggerFactory.getLogger(JooqScenarioRepository::class.java)

    override fun getScenarioAndCoverage(scenarioId: String): ScenarioAndCoverage {
        val scenario = scenarios.get(scenarioId)
        // TODO: It's a bit inefficient to pull in the whole country data, but given that this
        // is just a placeholder until there is a mapping from scenario to country, this will do
        val countries = getScenarioCountries(scenarioId).map { it.id }.toList()
        val coverage = getRoutineCoverage(scenarioId)
        val coverageByCountry = coverage
                .groupBy { it.country }
                .map { group -> CountryCoverage(group.key, group.value.map { YearCoverage(it.year, it.coverage?.toBigDecimal()) }) }
                .toList()
        return ScenarioAndCoverage(scenario, countries, 1996..2096, coverageByCountry)
    }

    private fun getRoutineCoverage(scenarioId: String): List<RoutineCoverageRecord> {
        return dsl
                .select(Tables.ROUTINE_COVERAGE.fields().toList())
                .from(Tables.COVERAGE_SCENARIO_DESCRIPTION
                        .join(Tables.COVERAGE_SCENARIO).onKey()
                        .join(Tables.ROUTINE_COVERAGE_SET).onKey()
                        .join(Tables.ROUTINE_COVERAGE).on(Tables.ROUTINE_COVERAGE_SET.ID.eq(Tables.ROUTINE_COVERAGE.ROUTINE_COVERAGE_SET))
                )
                .where(Tables.COVERAGE_SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchInto(Tables.ROUTINE_COVERAGE)
                .toList()
    }

    override fun getScenarioCountries(scenarioId: String): List<Country> {
        // TODO: Make the data model actually map from scenarios to countries
        return countries.all().toList()
    }

    private fun scenarioMapper(input: CoverageScenarioDescriptionRecord) = Scenario(
            id = input.id,
            description = input.description,
            disease = input.disease,
            vaccine = input.vaccine,
            scenarioType = input.scenarioType,
            vaccinationLevel = input.vaccinationLevel)
}
