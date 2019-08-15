package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.jooq.Record
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.BurdenEstimateCountryExpectation
import org.vaccineimpact.api.db.tables.BurdenEstimateExpectation
import org.vaccineimpact.api.db.tables.BurdenEstimateOutcomeExpectation
import org.vaccineimpact.api.db.tables.records.BurdenEstimateExpectationRecord
import org.vaccineimpact.api.models.*

data class ApplicableScenariosAndDisease(val scenarios: List<String>, val disease: String)

class JooqExpectationsRepository(dsl: DSLContext)
    : JooqRepository(dsl), ExpectationsRepository
{

    private object Tables
    {
        val expectations: BurdenEstimateExpectation = BURDEN_ESTIMATE_EXPECTATION
        val countries: BurdenEstimateCountryExpectation = BURDEN_ESTIMATE_COUNTRY_EXPECTATION
        val outcomes: BurdenEstimateOutcomeExpectation = BURDEN_ESTIMATE_OUTCOME_EXPECTATION
    }

    override fun getExpectationIdsForGroupAndTouchstone(groupId: String, touchstoneVersionId: String): List<Int>
    {
        return dsl.select(Tables.expectations.ID)
                .fromJoinPath(Tables.expectations, RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .join(TOUCHSTONE)
                .on(TOUCHSTONE.ID.eq(RESPONSIBILITY_SET.TOUCHSTONE))
                .where(TOUCHSTONE.ID.eq(touchstoneVersionId))
                .and(MODELLING_GROUP.ID.eq(groupId))
                .fetchInto(Int::class.java)
    }

    override fun getExpectationsForResponsibility(responsibilityId: Int): ExpectationMapping
    {
        val id = dsl.select(RESPONSIBILITY.EXPECTATIONS)
                .from(RESPONSIBILITY)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .fetchOne()
                .value1()
                ?: throw UnknownObjectError(responsibilityId, "burden-estimate-expectation")

        return getExpectationsById(id)
    }

    override fun getExpectationsById(expectationsId: Int): ExpectationMapping
    {
        val basicData = dsl.fetchAny(Tables.expectations, Tables.expectations.ID.eq(expectationsId))
        val expectations = basicData.withCountriesAndOutcomes()
        val scenarioRecords = dsl.select(SCENARIO_DESCRIPTION.ID, SCENARIO_DESCRIPTION.DISEASE)
                .fromJoinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.EXPECTATIONS.eq(expectationsId))
                .fetch()
        val (scenarios, disease) = getMappingInfoFromRecords(scenarioRecords, expectationsId)
        return ExpectationMapping(expectations, scenarios, disease)
    }

    override fun getExpectationsForResponsibilitySet(modellingGroup: String, touchstoneVersion: String): List<ExpectationMapping>
    {
        return dsl.select(Tables.expectations.fieldsAsList())
                .select(SCENARIO_DESCRIPTION.ID, SCENARIO_DESCRIPTION.DISEASE)
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, Tables.expectations)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(
                        RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersion)
                                .and(RESPONSIBILITY_SET.MODELLING_GROUP.eq(modellingGroup))
                )
                .groupBy { it[Tables.expectations.ID] }
                .map { getBasicDataAndMappingFromRecords(it.value) }
                .map { (basicData, mapping) ->
                    ExpectationMapping(
                            basicData.withCountriesAndOutcomes(),
                            mapping.scenarios,
                            mapping.disease
                    )
                }
    }

    override fun getAllExpectations(): List<TouchstoneModelExpectations>
    {
        val records = dsl.select(
                SCENARIO_DESCRIPTION.DISEASE,
                TOUCHSTONE.ID,
                RESPONSIBILITY_SET.MODELLING_GROUP,
                *BURDEN_ESTIMATE_EXPECTATION.fields(),
                SCENARIO.SCENARIO_DESCRIPTION,
                BURDEN_OUTCOME.CODE,
                BURDEN_OUTCOME.NAME)
                .fromJoinPath(RESPONSIBILITY, BURDEN_ESTIMATE_EXPECTATION)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY, RESPONSIBILITY_SET, TOUCHSTONE)
                .joinPath(BURDEN_ESTIMATE_EXPECTATION, Tables.outcomes, joinType = JoinType.LEFT_OUTER_JOIN)
                .leftJoin(BURDEN_OUTCOME)
                .on(Tables.outcomes.OUTCOME.eq(BURDEN_OUTCOME.CODE))
                .where(RESPONSIBILITY.IS_OPEN.eq(true))
                .and(TOUCHSTONE.STATUS.eq("open"))
                .and(SCENARIO.TOUCHSTONE.eq(RESPONSIBILITY_SET.TOUCHSTONE))
                .orderBy(RESPONSIBILITY_SET.MODELLING_GROUP, SCENARIO_DESCRIPTION.DISEASE, TOUCHSTONE.ID)

        val outcomes = records.groupBy{ it[BURDEN_ESTIMATE_EXPECTATION.ID] }
            .mapValues{
                it.value.mapNotNull{ row ->
                            if (row[BURDEN_OUTCOME.CODE] == null)
                            {
                                null
                            }
                            else
                            {
                                Outcome(row[BURDEN_OUTCOME.CODE], row[BURDEN_OUTCOME.NAME])
                            }
                        }.distinct()
            }

        val scenarios = records.groupBy{ it[BURDEN_ESTIMATE_EXPECTATION.ID] }
                .mapValues{
                    it.value.map{ row -> row[SCENARIO.SCENARIO_DESCRIPTION]}.distinct()
                }

        return records.groupBy{it[BURDEN_ESTIMATE_EXPECTATION.ID]}
                .map{
                    val fields = it.value.first()
                    TouchstoneModelExpectations(
                            fields[TOUCHSTONE.ID], fields[RESPONSIBILITY_SET.MODELLING_GROUP],
                            fields[SCENARIO_DESCRIPTION.DISEASE],
                            fields.into(BurdenEstimateExpectationRecord::class.java)
                                    .toOutcomeExpectations(outcomes[it.key]!!),
                            scenarios[it.key]!!)
                }
    }

    private fun getBasicDataAndMappingFromRecords(records: List<Record>): Pair<BurdenEstimateExpectationRecord, ApplicableScenariosAndDisease>
    {
        val basicData = records.first().into(BurdenEstimateExpectationRecord::class.java)
        val mappingInfo = getMappingInfoFromRecords(records, basicData.id)
        return Pair(basicData, mappingInfo)
    }

    private fun getMappingInfoFromRecords(records: List<Record>, expectationsId: Int?): ApplicableScenariosAndDisease
    {
        val scenarios = records.map { it[SCENARIO_DESCRIPTION.ID] }.distinct().sorted()
        val diseases = records.map { it[SCENARIO_DESCRIPTION.DISEASE] }.distinct()
        val disease = diseases.singleOrNull()
                ?: throw DatabaseContentsError("CountryOutcomeExpectations $expectationsId is used by responsibilities that do not all share the same disease: ${diseases.joinToString()}")
        return ApplicableScenariosAndDisease(scenarios, disease)
    }

    private fun BurdenEstimateExpectationRecord.toOutcomeExpectations(outcomes: List<Outcome>): OutcomeExpectations
    {
        val record = this
        return OutcomeExpectations(
                record.id,
                record.description,
                record.yearMinInclusive..record.yearMaxInclusive,
                record.ageMinInclusive..record.ageMaxInclusive,
                CohortRestriction(record.cohortMinInclusive, record.cohortMaxInclusive),
                outcomes.sortedBy { it.code }
        )
    }

    private fun BurdenEstimateExpectationRecord.withCountriesAndOutcomes(): CountryOutcomeExpectations
    {
        val record = this
        val countries = getCountries(record)
        val outcomes = getOutcomes(record)
        return CountryOutcomeExpectations(
                record.id,
                record.description,
                record.yearMinInclusive..record.yearMaxInclusive,
                record.ageMinInclusive..record.ageMaxInclusive,
                CohortRestriction(record.cohortMinInclusive, record.cohortMaxInclusive),
                countries,
                outcomes
        )
    }

    private fun getOutcomes(basicData: BurdenEstimateExpectationRecord): List<Outcome>
    {
        return dsl.select(BURDEN_OUTCOME.CODE, BURDEN_OUTCOME.NAME)
                .from(Tables.outcomes)
                .join(BURDEN_OUTCOME)
                .on(Tables.outcomes.OUTCOME.eq(BURDEN_OUTCOME.CODE))
                .where(Tables.outcomes.BURDEN_ESTIMATE_EXPECTATION.eq(basicData.id))
                .fetchInto(Outcome::class.java)
                .toList()
    }

    private fun getCountries(basicData: BurdenEstimateExpectationRecord): List<Country>
    {
        return dsl.select(COUNTRY.ID, COUNTRY.NAME)
                .fromJoinPath(Tables.countries, COUNTRY)
                .where(Tables.countries.BURDEN_ESTIMATE_EXPECTATION.eq(basicData.id))
                .fetchInto(Country::class.java)
                .toList()
    }
}
