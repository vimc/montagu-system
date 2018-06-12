package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.*

class JooqResponsibilitiesRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        private val touchstoneRepository: TouchstoneRepository,
        private val mapper: BurdenMappingHelper = BurdenMappingHelper()
) : JooqRepository(dsl), ResponsibilitiesRepository
{

    private fun convertScenarioToResponsibility(scenario: Scenario, responsibilityId: Int): Responsibility
    {
        val burdenEstimateSet = getCurrentBurdenEstimate(responsibilityId)
        val problems: MutableList<String> = mutableListOf()
        val status = if (burdenEstimateSet == null)
        {
            ResponsibilityStatus.EMPTY
        }
        else
        {
            if (burdenEstimateSet.problems.any())
            {
                problems.addAll(burdenEstimateSet.problems)
                ResponsibilityStatus.INVALID
            }
            else
            {
                ResponsibilityStatus.VALID
            }
        }
        return Responsibility(scenario, status, problems, burdenEstimateSet)
    }

    private fun getCurrentBurdenEstimate(responsibilityId: Int): BurdenEstimateSet?
    {
        val table = Tables.BURDEN_ESTIMATE_SET
        val records = dsl.select(Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM)
                .select(
                        table.UPLOADED_ON,
                        table.UPLOADED_BY,
                        table.SET_TYPE,
                        table.SET_TYPE_DETAILS,
                        table.STATUS,
                        table.ID
                )
                .fromJoinPath(table, Tables.BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(Tables.RESPONSIBILITY)
                .on(Tables.RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET.eq(Tables.BURDEN_ESTIMATE_SET.ID))
                .where(Tables.RESPONSIBILITY.ID.eq(responsibilityId))
                .fetch()

        return mapBurdenEstimateSet(records)
    }


    private fun mapBurdenEstimateSet(input: List<Record>): BurdenEstimateSet?
    {
        if (!input.any())
        {
            return null
        }

        val first = input.first()
        val uploadedOn = first[Tables.BURDEN_ESTIMATE_SET.UPLOADED_ON].toInstant()
        return BurdenEstimateSet(
                id = first[Tables.BURDEN_ESTIMATE_SET.ID],
                uploadedBy = first[Tables.BURDEN_ESTIMATE_SET.UPLOADED_BY],
                uploadedOn = uploadedOn,
                type = mapper.mapBurdenEstimateSetType(first),
                status = mapper.mapEnum(first[Tables.BURDEN_ESTIMATE_SET.STATUS]),
                problems = input.filter { it[Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] != null }
                        .map { it[Tables.BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] }
        )
    }

    override fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                                     scenarioFilterParameters: ScenarioFilterParameters,
                                     touchstoneVersionId: String): Responsibilities
    {
        if (responsibilitySet != null)
        {
            val responsibilities = getResponsibilitiesInResponsibilitySet(
                    responsibilitySet.id,
                    { this.whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters) }
            )
            val status = mapper.mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return Responsibilities(touchstoneVersionId, "", status, responsibilities)
        }
        else
        {
            return Responsibilities(touchstoneVersionId, "", ResponsibilitySetStatus.NOT_APPLICABLE, emptyList())
        }
    }

    override fun getResponsibility(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityAndTouchstone
    {
        val touchstone = getTouchstone(touchstoneVersionId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneVersionId)
        if (responsibilitySet != null)
        {
            val responsibility = getResponsibilitiesInResponsibilitySet(
                    responsibilitySet.id,
                    { this.and(Tables.SCENARIO_DESCRIPTION.ID.eq(scenarioId)) }
            ).singleOrNull() ?: throw UnknownObjectError(scenarioId, "responsibility")
            return ResponsibilityAndTouchstone(touchstone, responsibility)
        }
        else
        {
            throw UnknownObjectError(scenarioId, "responsibility")
        }
    }

    override fun getResponsibilitiesForGroupAndTouchstone(groupId: String, touchstoneVersionId: String,
                                                          scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus
    {
        val touchstone = getTouchstone(touchstoneVersionId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneVersionId)
        val responsibilities = getResponsibilities(responsibilitySet, scenarioFilterParameters, touchstoneVersionId)
        return ResponsibilitiesAndTouchstoneStatus(responsibilities, touchstone.status)
    }

    private fun getResponsibilitySet(groupId: String, touchstoneVersionId: String): ResponsibilitySetRecord?
    {
        return dsl.fetchAny(Tables.RESPONSIBILITY_SET,
                Tables.RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(Tables.RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId)))
    }

    override fun getResponsibilitiesForTouchstone(touchstoneVersionId: String): List<ResponsibilitySet>
    {
        val results = this.dsl.select(Tables.RESPONSIBILITY_SET.ID, Tables.RESPONSIBILITY_SET.STATUS, Tables.MODELLING_GROUP.ID)
                .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.MODELLING_GROUP)
                .where(Tables.RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                .fetch()

        return results.map({
            val id = it[Tables.RESPONSIBILITY_SET.ID] as Int
            val responsibilities = getResponsibilitiesInResponsibilitySet(id,
                    { this })

            ResponsibilitySet(it[Tables.MODELLING_GROUP.ID], touchstoneVersionId,
                    mapper.mapEnum(it[Tables.RESPONSIBILITY_SET.STATUS]), responsibilities)
        })
    }

    private fun getTouchstone(touchstoneVersionId: String) = touchstoneRepository.touchstones.get(touchstoneVersionId)

    private fun getResponsibilitiesInResponsibilitySet(
            responsibilitySetId: Int,
            applyWhereFilter: SelectConditionStep<Record2<String, Int>>.() -> SelectConditionStep<Record2<String, Int>>)
            : List<Responsibility>
    {
        val records = dsl
                .select(Tables.SCENARIO_DESCRIPTION.ID, Tables.RESPONSIBILITY.ID)
                .fromJoinPath(Tables.RESPONSIBILITY_SET, Tables.RESPONSIBILITY, Tables.SCENARIO, Tables.SCENARIO_DESCRIPTION)
                .where(Tables.RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySetId))
                // TODO remove this once VIMC-1240 is done
                // this check is needed for the situation where a group has a responsibility set with
                // multiple diseases, but we want to 'close' some and not others for a touchstoneVersion
                // it will be obsolete when we refactor responsibility sets to be single disease only
                .and(Tables.RESPONSIBILITY.IS_OPEN)
                .applyWhereFilter()
                .fetch()
                .intoMap(Tables.SCENARIO_DESCRIPTION.ID)

        val scenarioIds = records.keys
        val scenarios = scenarioRepository.getScenarios(scenarioIds)
        return scenarios.map {
            convertScenarioToResponsibility(it, records[it.id]!![Tables.RESPONSIBILITY.ID])
        }
    }

}