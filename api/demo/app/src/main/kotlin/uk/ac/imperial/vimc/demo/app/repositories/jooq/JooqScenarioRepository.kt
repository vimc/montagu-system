package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.slf4j.LoggerFactory
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.ScenarioAndCoverage
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.CoverageScenarioDescriptionRecord
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository

@Suppress("unused")
class JooqScenarioRepository(context: JooqContext) : JooqRepository(context), ScenarioRepository {
    override val countries: DataSet<Country, String> = JooqDataSet(dsl, Tables.COUNTRY, Tables.COUNTRY.CODE, { Country(it.code, it.name) })
    override val scenarios: DataSet<Scenario, String>
            get() = JooqDataSet(dsl, Tables.COVERAGE_SCENARIO_DESCRIPTION, Tables.COVERAGE_SCENARIO_DESCRIPTION.ID, this::scenarioMapper)

    override fun getScenarios(scenarioFilterParameters: ScenarioFilterParameters): Iterable<Scenario> {
        val table = Tables.COVERAGE_SCENARIO_DESCRIPTION
        val filterable = dsl.selectFrom(table).where()
        return JooqScenarioFilter()
                .apply(filterable, scenarioFilterParameters)
                .fetch()
                .map(this::scenarioMapper)
    }


    private val logger = LoggerFactory.getLogger(JooqScenarioRepository::class.java)

    override fun getScenarioAndCoverage(key: String): ScenarioAndCoverage {
        val records = dsl.select()
                .from(Tables.COVERAGE_SCENARIO_DESCRIPTION
                        .join(Tables.COVERAGE_SCENARIO).onKey()
                        .join(Tables.ROUTINE_COVERAGE_SET).onKey()
                        //.join(Tables.ROUTINE_COVERAGE).using(Tables.ROUTINE_COVERAGE_SET.ID)
                )
                .fetch()
        records.forEach { logger.warn(it.toString()) }
        throw Exception("MEESE!")

    }
    override fun getScenarioCountries(scenarioId: String): List<Country> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    private fun scenarioMapper(input: CoverageScenarioDescriptionRecord) = Scenario(
            id = input.id,
            description = input.description,
            disease = input.disease,
            vaccine = input.vaccine,
            scenarioType = input.scenarioType,
            vaccinationLevel = input.vaccinationLevel)
}
