package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
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
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.ExpectationMapping
import org.vaccineimpact.api.models.Expectations

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
                ?: throw DatabaseContentsError("Expectations $expectationsId is used by responsibilities that do not all share the same disease: ${diseases.joinToString()}")
        return ApplicableScenariosAndDisease(scenarios, disease)
    }

    private fun BurdenEstimateExpectationRecord.withCountriesAndOutcomes(): Expectations
    {
        val record = this
        val countries = getCountries(record)
        val outcomes = getOutcomes(record)
        return Expectations(
                record.id,
                record.yearMinInclusive..record.yearMaxInclusive,
                record.ageMinInclusive..record.ageMaxInclusive,
                CohortRestriction(record.cohortMinInclusive, record.cohortMaxInclusive),
                countries,
                outcomes
        )
    }

    private fun getOutcomes(basicData: BurdenEstimateExpectationRecord): List<String>
    {
        return dsl.select(Tables.outcomes.OUTCOME)
                .from(Tables.outcomes)
                .where(Tables.outcomes.BURDEN_ESTIMATE_EXPECTATION.eq(basicData.id))
                .fetchInto(String::class.java)
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
