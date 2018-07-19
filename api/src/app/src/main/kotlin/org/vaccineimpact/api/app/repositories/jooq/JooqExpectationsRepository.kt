package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
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

class JooqExpectationsRepository(dsl: DSLContext)
    : JooqRepository(dsl), ExpectationsRepository
{
    private object Tables
    {
        val expectations: BurdenEstimateExpectation = BURDEN_ESTIMATE_EXPECTATION
        val countries: BurdenEstimateCountryExpectation = BURDEN_ESTIMATE_COUNTRY_EXPECTATION
        val outcomes: BurdenEstimateOutcomeExpectation = BURDEN_ESTIMATE_OUTCOME_EXPECTATION
    }

    override fun getExpectationsForResponsibility(responsibilityId: Int): Expectations
    {
        val id = dsl.select(RESPONSIBILITY.EXPECTATIONS)
                .from(RESPONSIBILITY)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .fetchOne()
                .value1()
                ?: throw UnknownObjectError(responsibilityId, "burden-estimate-expectation")

        val basicData = dsl.fetchAny(Tables.expectations,Tables.expectations.ID.eq(id))
        return basicData.withCountriesAndOutcomes()
    }

    override fun getExpectationsForResponsibilitySet(modellingGroup: String, touchstoneVersion: String): List<ExpectationMapping>
    {
        return dsl.select(Tables.expectations.fieldsAsList())
                .select(SCENARIO.SCENARIO_DESCRIPTION)
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, Tables.expectations)
                .joinPath(RESPONSIBILITY, SCENARIO)
                .where(
                        RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersion)
                                .and(RESPONSIBILITY_SET.MODELLING_GROUP.eq(modellingGroup))
                )
                .groupBy { it[Tables.expectations.ID] }
                .map { getBasicDataAndApplicableScenariosFromRecords(it.value) }
                .map { (basicData, scenarios) -> ExpectationMapping(basicData.withCountriesAndOutcomes(), scenarios) }
    }

    private fun getBasicDataAndApplicableScenariosFromRecords(records: List<Record>): Pair<BurdenEstimateExpectationRecord, List<String>>
    {
        val basicData = records.first().into(BurdenEstimateExpectationRecord::class.java)
        val scenarios = records.map { it[SCENARIO.SCENARIO_DESCRIPTION] }
        return Pair(basicData, scenarios)
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
