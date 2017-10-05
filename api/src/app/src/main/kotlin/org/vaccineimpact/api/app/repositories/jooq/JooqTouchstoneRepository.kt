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
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.TouchstoneRecord
import org.vaccineimpact.api.models.*
import java.math.BigDecimal

class JooqTouchstoneRepository(dsl: DSLContext, private val scenarioRepository: ScenarioRepository)
    : JooqRepository(dsl), TouchstoneRepository
{
    override fun getDemographicDataset(statisticTypeCode: String,
                                       source: String,
                                       touchstoneId: String,
                                       gender: String): SplitData<DemographicDataForTouchstone, DemographicRow>
    {
        val touchstone = touchstones.get(touchstoneId)
        val records = getDemographicStatistics(
                touchstoneId,
                statisticTypeCode,
                source,
                gender)
                .orderBy(DEMOGRAPHIC_STATISTIC.COUNTRY, DEMOGRAPHIC_STATISTIC.YEAR, DEMOGRAPHIC_STATISTIC.AGE_FROM)
                .fetch()

        val rows = records.map {
            mapDemographicRow(it)
        }

        val statType = getDemographicDatasetMetadata(statisticTypeCode)
                .fetchAny() ?: throw UnknownObjectError(statisticTypeCode, "demographic-statistic-type")

        val dataset = mapDemographicDatasetMetadata(statType, records)

        val metadata = DemographicDataForTouchstone(touchstone, dataset)

        return SplitData(metadata, DataTable.new(rows))
    }

    fun mapDemographicDatasetMetadata(statType: Record, records: List<Record>): DemographicDataset
    {
        val countries =
                if (records.any())
                {
                    records.map { it[DEMOGRAPHIC_STATISTIC.COUNTRY] }.distinct().sortedBy { it }
                }
                else
                {
                    listOf()
                }

        val referenceRecord = records.firstOrNull()

        val source = referenceRecord?.getField<String>(name(TOUCHSTONE_SOURCES, "sourceCode"))
        val gender = referenceRecord?.get(GENDER.NAME)

        return DemographicDataset(statType[DEMOGRAPHIC_STATISTIC_TYPE.CODE],
                statType[DEMOGRAPHIC_STATISTIC_TYPE.NAME],
                gender,
                countries,
                statType[DEMOGRAPHIC_VALUE_UNIT.NAME],
                statType[DEMOGRAPHIC_STATISTIC_TYPE.AGE_INTERPRETATION],
                source)
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
        }.sortedBy { it.name }
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

    private val TOUCHSTONE_SOURCES = "touchstoneSources"
    private val STATS_IN_SOURCES = "statsInTouchstoneSources"

    private fun countriesInTouchstone(touchstoneId: String): SelectConditionStep<Record1<String>>
    {
        return dsl.select(TOUCHSTONE_COUNTRY.COUNTRY)
                .from(TOUCHSTONE_COUNTRY)
                .where(TOUCHSTONE_COUNTRY.TOUCHSTONE.eq(touchstoneId))
    }

    private fun touchstoneSources(touchstoneId: String): SelectConditionStep<Record2<Int, String>>
    {
        return dsl.select(DEMOGRAPHIC_SOURCE.ID, DEMOGRAPHIC_SOURCE.CODE.`as`("sourceCode"))
                .from(DEMOGRAPHIC_SOURCE)
                .join(TOUCHSTONE_DEMOGRAPHIC_SOURCE)
                .on(DEMOGRAPHIC_SOURCE.ID.eq(TOUCHSTONE_DEMOGRAPHIC_SOURCE.DEMOGRAPHIC_SOURCE))
                .where(TOUCHSTONE_DEMOGRAPHIC_SOURCE.TOUCHSTONE.eq(touchstoneId))
    }

    private fun getDemographicStatisticTypesQuery(touchstoneId: String):
            SelectConditionStep<Record6<Int, String, String, Boolean, String, String>>
    {

        val touchstoneSources = dsl.select(DEMOGRAPHIC_SOURCE.ID, DEMOGRAPHIC_SOURCE.CODE.`as`("sourceCode"))
                .from(DEMOGRAPHIC_SOURCE)
                .join(TOUCHSTONE_DEMOGRAPHIC_SOURCE)
                .on(DEMOGRAPHIC_SOURCE.ID.eq(TOUCHSTONE_DEMOGRAPHIC_SOURCE.DEMOGRAPHIC_SOURCE))
                .where(TOUCHSTONE_DEMOGRAPHIC_SOURCE.TOUCHSTONE.eq(touchstoneId))

        val statsInTouchstoneSources = dsl.selectDistinct(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE,
                DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_STATISTIC_TYPE.`as`("typeId"),
                DEMOGRAPHIC_STATISTIC.COUNTRY.`as`("country"), field(name(TOUCHSTONE_SOURCES, "sourceCode"), String::class.java))
                .from(DEMOGRAPHIC_STATISTIC)
                .join(table(name(TOUCHSTONE_SOURCES)))
                .on(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE.eq(field(name(TOUCHSTONE_SOURCES, "id"), Int::class.java)))

        val countriesInTouchstone = countriesInTouchstone(touchstoneId)

        return dsl.with(TOUCHSTONE_SOURCES).`as`(touchstoneSources)
                .with(STATS_IN_SOURCES)
                .`as`(statsInTouchstoneSources)
                .selectDistinct(
                        DEMOGRAPHIC_STATISTIC_TYPE.ID,
                        DEMOGRAPHIC_STATISTIC_TYPE.CODE,
                        DEMOGRAPHIC_STATISTIC_TYPE.NAME,
                        DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE,
                        field(name(STATS_IN_SOURCES, "sourceCode"), String::class.java),
                        field<String>(name(STATS_IN_SOURCES, "country"), String::class.java))
                .from(table(name(STATS_IN_SOURCES)))
                .join(DEMOGRAPHIC_STATISTIC_TYPE)
                .on(DEMOGRAPHIC_STATISTIC_TYPE.ID.eq(field(name(STATS_IN_SOURCES, "typeId"), Int::class.java)))
                .where(field(name(STATS_IN_SOURCES, "country"), String::class.java)
                        .`in`(countriesInTouchstone))
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
                                         sourceCode: String,
                                         gender: String):
            SelectConditionStep<Record8<Int, Int, String, Int, Int, BigDecimal, String, String>>
    {
        // we are hard coding this here for now - need to revisit data model longer term
        val variantNames = listOf("unwpp_estimates", "unwpp_medium_variant", "wpp_cm_hybrid")

        val countriesInTouchstone = countriesInTouchstone(touchstoneId)

        val sources = touchstoneSources(touchstoneId)
                .and(DEMOGRAPHIC_SOURCE.CODE.eq(sourceCode))

        val variants = dsl.select(DEMOGRAPHIC_VARIANT.ID)
                .from(DEMOGRAPHIC_VARIANT)
                .where(DEMOGRAPHIC_VARIANT.CODE.`in`(variantNames))

        val types = dsl.select(DEMOGRAPHIC_STATISTIC_TYPE.ID, DEMOGRAPHIC_STATISTIC_TYPE.GENDER_IS_APPLICABLE)
                .from(DEMOGRAPHIC_STATISTIC_TYPE)
                .where(DEMOGRAPHIC_STATISTIC_TYPE.CODE.eq(typeCode))

        var selectQuery = dsl
                .with(TOUCHSTONE_SOURCES).`as`(sources)
                .with("v").`as`(variants)
                .with("t").`as`(types)
                .with("c").`as`(countriesInTouchstone)
                .select(DEMOGRAPHIC_STATISTIC.AGE_FROM,
                        DEMOGRAPHIC_STATISTIC.AGE_TO,
                        DEMOGRAPHIC_STATISTIC.COUNTRY,
                        COUNTRY.NID,
                        DEMOGRAPHIC_STATISTIC.YEAR,
                        DEMOGRAPHIC_STATISTIC.VALUE,
                        field(name(TOUCHSTONE_SOURCES, "sourceCode"), String::class.java),
                        GENDER.NAME)
                .from(DEMOGRAPHIC_STATISTIC)
                .join(GENDER)
                .on(GENDER.ID.eq(DEMOGRAPHIC_STATISTIC.GENDER))
                .join(COUNTRY)
                .on(COUNTRY.ID.eq(DEMOGRAPHIC_STATISTIC.COUNTRY))

        // only select for given source and source in given touchstone
        selectQuery = selectQuery.join(table(name(TOUCHSTONE_SOURCES)))
                .on(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_SOURCE.eq(field(name(TOUCHSTONE_SOURCES, "id"), Int::class.java)))

        // only select for the given type
        selectQuery = selectQuery
                .join(table(name("t")))
                .on(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_STATISTIC_TYPE.eq(field(name("t", "id"), Int::class.java)))

        // if gender is not applicable for this statistic type, ignore passed genderCode parameter and match on "B"
        val genderMatchesOrShouldBeDefault = (GENDER.CODE.eq("both")
                .andNot(field(name("t", "gender_is_applicable"), Boolean::class.java)))
                .or(GENDER.CODE.eq(gender))

        return selectQuery
                .where(genderMatchesOrShouldBeDefault)
                .and(DEMOGRAPHIC_STATISTIC.DEMOGRAPHIC_VARIANT.`in`(variants))
                .and(DEMOGRAPHIC_STATISTIC.COUNTRY.`in`(countriesInTouchstone))
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

    inline fun <reified T: Any?> Record.getField(name: Name): T = this.get(name, T::class.java)

    fun mapDemographicStatisticType(records: List<Record>): DemographicStatisticType
    {
        val countries = records.map { it[TOUCHSTONE_COUNTRY.COUNTRY] }.distinct().sortedBy { it }
        val sources = records.map { it.getField<String>(name(TOUCHSTONE_SOURCES, "sourceCode")) }.distinct()

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
            record[COUNTRY.NID],
            record[DEMOGRAPHIC_STATISTIC.AGE_FROM],
            record[DEMOGRAPHIC_STATISTIC.AGE_TO],
            record[DEMOGRAPHIC_STATISTIC.YEAR],
            record[GENDER.NAME],
            record[DEMOGRAPHIC_STATISTIC.VALUE]
    )
}