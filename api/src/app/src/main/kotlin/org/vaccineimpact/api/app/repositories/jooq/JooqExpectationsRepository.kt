package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.BurdenEstimateCountryExpectation
import org.vaccineimpact.api.db.tables.BurdenEstimateExpectation
import org.vaccineimpact.api.db.tables.BurdenEstimateOutcomeExpectation
import org.vaccineimpact.api.db.tables.records.BurdenEstimateExpectationRecord
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
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

    override fun getExpectationIdsForGroupAndTouchstone(groupId: String, touchstoneVersionId: String): List<Int>
    {
        return dsl.select(Tables.expectations.ID)
                .fromJoinPath(Tables.expectations, RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .join(TOUCHSTONE)
                .on(TOUCHSTONE.ID.eq(RESPONSIBILITY_SET.TOUCHSTONE))
                .fetchInto(Int::class.java)
    }

    override fun getExpectationsForResponsibility(responsibilityId: Int): Expectations
    {
        val id = dsl.select(RESPONSIBILITY.EXPECTATIONS)
                        .from(RESPONSIBILITY)
                        .where(RESPONSIBILITY.ID.eq(responsibilityId))
                        .fetchOne()
                        .value1()
                        ?: throw UnknownObjectError(responsibilityId, "burden-estimate-expectation")
        
        return getExpectationsById(id)
    }

    override fun getExpectationsById(expectationsId: Int): Expectations
    {
        val basicData = dsl.fetchAny(Tables.expectations,Tables.expectations.ID.eq(expectationsId))

        val countries = getCountries(basicData)
        val outcomes = getOutcomes(basicData)

        return Expectations(
                basicData.id,
                basicData.yearMinInclusive..basicData.yearMaxInclusive,
                basicData.ageMinInclusive..basicData.ageMaxInclusive,
                CohortRestriction(basicData.cohortMinInclusive, basicData.cohortMaxInclusive),
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
