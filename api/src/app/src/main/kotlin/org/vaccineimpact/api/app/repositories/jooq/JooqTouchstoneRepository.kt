package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.JoinType
import org.jooq.Record
import org.jooq.Result
import org.jooq.SelectConditionStep
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.TouchstoneRecord
import org.vaccineimpact.api.models.*
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqSimpleDataSet

class JooqTouchstoneRepository(private val scenarioRepository: () -> JooqScenarioRepository)
    : JooqRepository(), TouchstoneRepository
{
    override val touchstones: SimpleDataSet<Touchstone, String>
        get() = JooqSimpleDataSet.new(dsl, TOUCHSTONE, { it.ID }, { mapTouchstone(it) })

    override fun scenarios(touchstoneId: String, filterParams: ScenarioFilterParameters): List<ScenarioAndCoverageSets>
    {
        val records = getScenariosAndCoverageSets(touchstoneId, includeCoverageData = false)
                .whereMatchesFilter(JooqScenarioFilter(), filterParams)
                // first by scenario, then by coverage set order within the scenario
                .orderBy(SCENARIO_DESCRIPTION.ID, SCENARIO_COVERAGE_SET.ORDER)
                .fetch()

        return getScenariosFromRecords(records).map {
            ScenarioAndCoverageSets(it, getCoverageSetsFromRecord(records, it))
        }
    }

    override fun getScenario(touchstoneId: String, scenarioDescId: String): ScenarioAndCoverageSets
    {
        val records = getCoverageSetsForScenario(touchstoneId, scenarioDescId, includeCoverageData = false)
        val scenario = getScenariosFromRecords(records).singleOrNull()
            ?: throw UnknownObjectError(scenarioDescId, "scenario")
        return ScenarioAndCoverageSets(scenario, getCoverageSetsFromRecord(records, scenario))
    }

    override fun getScenarioAndCoverageData(
            touchstoneId: String,
            scenarioDescId: String
    ): SplitData<ScenarioAndCoverageSets, CoverageRow>
    {
        val records = getCoverageSetsForScenario(touchstoneId, scenarioDescId, includeCoverageData = true)
        val scenario = getScenariosFromRecords(records).singleOrNull()
                ?: throw UnknownObjectError(scenarioDescId, "scenario")
        val metadata = ScenarioAndCoverageSets(scenario, getCoverageSetsFromRecord(records, scenario))
        val coverageRows = records
                .filter { it[COVERAGE.ID] != null }
                .map { mapCoverageRow(it, scenarioDescId) }
        return SplitData(metadata, DataTable.new(coverageRows))
    }

    private fun getCoverageSetsForScenario(
            touchstoneId: String,
            scenarioDescriptionId: String,
            includeCoverageData: Boolean)
            : Result<Record>
    {
        return getScenariosAndCoverageSets(touchstoneId, includeCoverageData)
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioDescriptionId))
                .orderBy(SCENARIO_COVERAGE_SET.ORDER)
                .fetch()
    }

    private fun getScenariosAndCoverageSets(touchstoneId: String, includeCoverageData: Boolean): SelectConditionStep<Record>
    {
        var selectQuery = dsl
                .select(SCENARIO_DESCRIPTION.fieldsAsList())
                .select(COVERAGE_SET.fieldsAsList())
                .select(TOUCHSTONE.ID)
        if (includeCoverageData)
        {
            selectQuery = selectQuery
                    .select(COVERAGE.fieldsAsList())
                    .select(SCENARIO_COVERAGE_SET.ORDER)
        }
        var fromQuery = selectQuery
                .fromJoinPath(TOUCHSTONE, SCENARIO)
                .joinPath(SCENARIO, SCENARIO_DESCRIPTION)
                // We don't mind if there are no coverage sets, so do a left join
                .joinPath(SCENARIO, SCENARIO_COVERAGE_SET, COVERAGE_SET, joinType = JoinType.LEFT_OUTER_JOIN)
        if (includeCoverageData)
        {
            // We don't mind if there are 0 rows of coverage data, so do a left join
            fromQuery = fromQuery.joinPath(COVERAGE_SET, COVERAGE, joinType = JoinType.LEFT_OUTER_JOIN)
        }
        return fromQuery.where(TOUCHSTONE.ID.eq(touchstoneId))
    }

    private fun getScenariosFromRecords(records: Result<Record>): List<Scenario>
    {
        val scenarioIds = records.map { it[SCENARIO_DESCRIPTION.ID] }
        return scenarioRepository().use { scenarioRepo ->
            scenarioRepo.getScenarios(scenarioIds)
        }
    }

    private fun getCoverageSetsFromRecord(records: Result<Record>, scenario: Scenario) =
            records
                .filter { it[SCENARIO_DESCRIPTION.ID] == scenario.id && it[COVERAGE_SET.ID] != null }
                .distinctBy { it[COVERAGE_SET.ID]  }
                .map { mapCoverageSet(it) }

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
            mapEnum(record[COVERAGE_SET.GAVI_SUPPORT_LEVEL]),
            mapEnum(record[COVERAGE_SET.ACTIVITY_TYPE])
    )

    fun mapCoverageRow(record: Record, scenarioDescriptionId: String) = CoverageRow(
            scenarioDescriptionId,
            record[COVERAGE_SET.ID],
            record[SCENARIO_COVERAGE_SET.ORDER] + 1, // index from 1 for human readability
            record[COVERAGE_SET.NAME],
            record[COVERAGE_SET.VACCINE],
            mapEnum(record[COVERAGE_SET.GAVI_SUPPORT_LEVEL]),
            mapEnum(record[COVERAGE_SET.ACTIVITY_TYPE]),
            record[COVERAGE.COUNTRY],
            record[COVERAGE.YEAR],
            record[COVERAGE.AGE_FROM],
            record[COVERAGE.AGE_TO],
            record[COVERAGE.AGE_RANGE_VERBATIM],
            record[COVERAGE.TARGET],
            record[COVERAGE.COVERAGE_]
    )
}