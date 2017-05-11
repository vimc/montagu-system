package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.TouchstoneRecord
import org.vaccineimpact.api.models.CoverageSet
import org.vaccineimpact.api.models.ScenarioAndCoverageSets
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.YearRange
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqSimpleDataSet

class JooqTouchstoneRepository(private val scenarioRepository: () -> JooqScenarioRepository)
    : JooqRepository(), TouchstoneRepository
{
    override val touchstones: SimpleDataSet<Touchstone, String>
        get() = JooqSimpleDataSet.new(dsl, TOUCHSTONE, { it.ID }, { mapTouchstone(it) })

    override fun scenarios(touchstoneId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    {
        scenarioRepository().use { scenarioRepo ->
            val records = dsl
                    .select(SCENARIO_DESCRIPTION.fieldsAsList())
                    .select(COVERAGE_SET.fieldsAsList())
                    .select(TOUCHSTONE.ID)
                    .fromJoinPath(TOUCHSTONE, SCENARIO)
                    .joinPath(SCENARIO, SCENARIO_DESCRIPTION)
                    .joinPath(SCENARIO, SCENARIO_COVERAGE_SET, COVERAGE_SET)
                    .where(TOUCHSTONE.ID.eq(touchstoneId))
                    .whereMatchesFilter(JooqScenarioFilter(), filterParams)
                    .orderBy(SCENARIO_DESCRIPTION.ID, SCENARIO_COVERAGE_SET.ORDER)
                    .fetch()

            val scenarioIds = records.map { it[SCENARIO_DESCRIPTION.ID] }
            val scenarios = scenarioRepo.getScenarios(scenarioIds)
            return scenarios.map { scenario ->
                val sets = records
                        .filter { it[SCENARIO_DESCRIPTION.ID] == scenario.id }
                        .map { mapCoverageSet(it) }
                ScenarioAndCoverageSets(scenario, sets)
            }
        }
    }

    fun mapTouchstone(record: TouchstoneRecord) = Touchstone(
            record.id,
            record.touchstoneName,
            record.version,
            record.description,
            YearRange(record.yearStart, record.yearEnd),
            mapEnum(record.status)
    )

    fun mapCoverageSet(record: Record) = CoverageSet(
            record[COVERAGE_SET.ID],
            record[TOUCHSTONE.ID],
            record[COVERAGE_SET.NAME],
            record[COVERAGE_SET.VACCINE],
            record[COVERAGE_SET.GAVI_SUPPORT_LEVEL],
            record[COVERAGE_SET.ACTIVITY_TYPE]
    )
}