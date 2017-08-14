package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.jooq.Result
import org.jooq.impl.DSL.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.TouchstoneRecord
import org.vaccineimpact.api.models.*
import java.math.BigDecimal

class JooqTouchstoneRepository(
        db: JooqContext,
        private val scenarioRepository: ScenarioRepository
)
    : JooqRepository(db), TouchstoneRepository
{
    override fun getDemographicDataset(statisticTypeCode: String,
                                       source: String,
                                       touchstoneId: String): SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstone = touchstones.get(touchstoneId)
        val records = getDemographicStatistics(
                touchstoneId,
                statisticTypeCode,
                source)
                .fetch()

        val rows = records.map {
                    mapDemographicRow(it)
                }

        val dataset =
                if (rows.count() == 0)
                {
                    null
                }
                else
                {
                    val statType = getDemographicDatasetMetadata(statisticTypeCode)
                            .fetchAny()

                    val referenceRecord = records.first()

                    mapDemographicDatasetMetadata(statType[DEMOGRAPHIC_STATISTIC_TYPE.CODE],
                            statType[DEMOGRAPHIC_STATISTIC_TYPE.NAME],
                            referenceRecord[GENDER.NAME],
                            statType[DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE],
                            statType[DEMOGRAPHIC_VALUE_UNIT.NAME],
                            statType[DEMOGRAPHIC_STATISTIC_TYPE.AGE_INTERPRETATION],
                            referenceRecord[DEMOGRAPHIC_SOURCE.NAME],
                            rows.map{ it.country }.distinct().sortedBy { it })
                }

        val metadata = DemographicDataForTouchstone(touchstone, dataset)

        return SplitData(metadata, DataTable.new(rows))
    }

    fun mapDemographicDatasetMetadata(id: String,
                                      name: String,
                                      gender: String,
                                      genderIsApplicable: Boolean,
                                      unit: String,
                                      ageInterpretation: String,
                                      source: String,
                                      countries: List<String>): DemographicDataset
    {
        val nullableGender: String? =
                if (genderIsApplicable)
                {
                    gender
                }
                else
                {
                    null
                }
        return DemographicDataset(id, name, nullableGender, countries, unit, ageInterpretation, source)
    }

    override fun getDemographicStatisticTypes(touchstoneId: String): List<DemographicStatisticType>
    {
        val records = getDemographicStatisticTypesQuery(touchstoneId)
                .fetch()

        val recordsGroupedByType = records.groupBy {
            it[DEMOGRAPHIC_STATISTIC_TYPE.ID]
        }

        return recordsGroupedByType.values.map {
            mapDemographicStatisticType(it)
        }
    }

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


    private fun getDemographicStatisticTypesQuery(touchstoneId: String):
            SelectOnConditionStep<Record6<Int, String, String, Boolean, String, String>>
    {
        val statsInTouchstoneCountriesAndSources =
                dsl.selectDistinct(DEMOGRAPHIC_SOURCE.CODE.`as`("sourceCode"),
                        DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_STATISTIC_TYPE.`as`("typeId"),
                        TOUCHSTONE_COUNTRY.COUNTRY.`as`("country"))
                        .from(DEMOGRAPHIC_STATISTIC)
                        .join(TOUCHSTONE_COUNTRY)
                        .on(DEMOGRAPHIC_STATISTIC.COUNTRY.eq(TOUCHSTONE_COUNTRY.COUNTRY))
                        .join(DEMOGRAPHIC_SOURCE)
                        .on(DEMOGRAPHIC_SOURCE.ID.eq(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE))
                        .join(TOUCHSTONE_DEMOGRAPHIC_SOURCE)
                        .on(DEMOGRAPHIC_SOURCE.ID.eq(TOUCHSTONE_DEMOGRAPHIC_SOURCE.DEMOGRAPHIC_SOURCE))
                        .where(TOUCHSTONE_COUNTRY.TOUCHSTONE.eq(touchstoneId))
                        .and(TOUCHSTONE_DEMOGRAPHIC_SOURCE.TOUCHSTONE.eq(touchstoneId))

        return dsl.with("s")
                .`as`(statsInTouchstoneCountriesAndSources)
                .selectDistinct(
                        DEMOGRAPHIC_STATISTIC_TYPE.ID,
                        DEMOGRAPHIC_STATISTIC_TYPE.CODE,
                        DEMOGRAPHIC_STATISTIC_TYPE.NAME,
                        DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE,
                        field(name("s", "sourceCode"), String::class.java),
                        field(name("s", "country"), String::class.java))
                .from(table(name("s")))
                .join(DEMOGRAPHIC_STATISTIC_TYPE)
                .on(DEMOGRAPHIC_STATISTIC_TYPE.ID.eq(field(name("s", "typeId"), Int::class.java)))
    }

    private fun getDemographicDatasetMetadata(typeCode: String):
            Select<Record5<String, String, String, String, Boolean>>
    {
        return dsl.select(
                DEMOGRAPHIC_STATISTIC_TYPE.CODE,
                DEMOGRAPHIC_STATISTIC_TYPE.NAME,
                DEMOGRAPHIC_STATISTIC_TYPE.AGE_INTERPRETATION,
                DEMOGRAPHIC_VALUE_UNIT.NAME,
                DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE)
                .from(DEMOGRAPHIC_STATISTIC_TYPE)
                .join(DEMOGRAPHIC_VALUE_UNIT)
                .on(DEMOGRAPHIC_STATISTIC_TYPE.DEMOGRAPHIC_VALUE_UNIT.eq(DEMOGRAPHIC_VALUE_UNIT.ID))
                .where(DEMOGRAPHIC_STATISTIC_TYPE.CODE.eq(typeCode))

    }

    private fun getDemographicStatistics(touchstoneId: String,
                                         typeCode: String,
                                         sourceCode: String):
            Select<Record7<Int, Int, String, Int, BigDecimal, String, String>>
    {
        // we are hard coding this here for now - need to revisit data model longer term
        val variants = listOf("unwpp_estimates", "unwpp_medium_variant", "cm_median")

        // hard coding for now
        val gender: String = "B"

        var selectQuery = dsl.select(DEMOGRAPHIC_STATISTIC.AGE_FROM,
                DEMOGRAPHIC_STATISTIC.AGE_TO,
                DEMOGRAPHIC_STATISTIC.COUNTRY,
                DEMOGRAPHIC_STATISTIC.YEAR,
                DEMOGRAPHIC_STATISTIC.VALUE,
                DEMOGRAPHIC_SOURCE.NAME,
                GENDER.NAME)
                .from(DEMOGRAPHIC_STATISTIC)
                .join(GENDER)
                .on(GENDER.ID.eq(DEMOGRAPHIC_STATISTIC.GENDER))

        // only select for countries in given touchstone
        selectQuery = selectQuery.join(TOUCHSTONE_COUNTRY)
                .on(DEMOGRAPHIC_STATISTIC.COUNTRY.eq(TOUCHSTONE_COUNTRY.COUNTRY))


        // only select for given source and source in given touchstone
        selectQuery = selectQuery.join(DEMOGRAPHIC_SOURCE)
                .on(DEMOGRAPHIC_SOURCE.ID.eq(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE))
                .join(TOUCHSTONE_DEMOGRAPHIC_SOURCE)
                .on(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE.eq(TOUCHSTONE_DEMOGRAPHIC_SOURCE.DEMOGRAPHIC_SOURCE))

        // only select default variants
        selectQuery = selectQuery
                .join(DEMOGRAPHIC_VARIANT)
                .on(DEMOGRAPHIC_VARIANT.ID.eq(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_VARIANT))

        // only select for the given type
        selectQuery = selectQuery
                .join(DEMOGRAPHIC_STATISTIC_TYPE)
                .on(DEMOGRAPHIC_STATISTIC_TYPE.ID.eq(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_STATISTIC_TYPE))

        return selectQuery
                .where(DEMOGRAPHIC_STATISTIC_TYPE.CODE.eq(typeCode))
                .and(TOUCHSTONE_COUNTRY.TOUCHSTONE.eq(touchstoneId))
                .and(TOUCHSTONE_DEMOGRAPHIC_SOURCE.TOUCHSTONE.eq(touchstoneId))
                .and(DEMOGRAPHIC_SOURCE.CODE.eq(sourceCode))
                .and(DEMOGRAPHIC_VARIANT.CODE.`in`(variants))
                .and(GENDER.CODE.eq(gender))
    }

    private fun getScenariosFromRecords(records: Result<Record>): List<Scenario>
    {
        val scenarioIds = records.map { it[SCENARIO_DESCRIPTION.ID] }
        return scenarioRepository.getScenarios(scenarioIds)
    }

    private fun getCoverageSetsFromRecord(records: Result<Record>, scenario: Scenario) =
            records
                    .filter { it[SCENARIO_DESCRIPTION.ID] == scenario.id && it[COVERAGE_SET.ID] != null }
                    .distinctBy { it[COVERAGE_SET.ID] }
                    .map { mapCoverageSet(it) }

    fun mapTouchstone(record: TouchstoneRecord) = Touchstone(
            record.id,
            record.touchstoneName,
            record.version,
            record.description,
            mapEnum(record.status)
    )

    fun mapDemographicStatisticType(records: List<Record>): DemographicStatisticType
    {
        val countries = records.map { it[TOUCHSTONE_COUNTRY.COUNTRY] }.distinct().sortedBy { it }
        val sources = records.map { it[field(name("s", "sourceCode"), String::class.java)] }.distinct()

        // all other properties are the same for all records
        // so read all other properties from the first record
        val record = records.first()

        return DemographicStatisticType(
                record[DEMOGRAPHIC_STATISTIC_TYPE.CODE],
                record[DEMOGRAPHIC_STATISTIC_TYPE.NAME],
                record[DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE],
                countries,
                sources
        )
    }

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

    fun mapDemographicRow(record: Record) = DemographicRow(
            record[DEMOGRAPHIC_STATISTIC.COUNTRY],
            "${record[DEMOGRAPHIC_STATISTIC.AGE_FROM]} - ${record[DEMOGRAPHIC_STATISTIC.AGE_TO]}",
            record[DEMOGRAPHIC_STATISTIC.YEAR],
            record[GENDER.NAME],
            record[DEMOGRAPHIC_STATISTIC.VALUE]
    )
}