package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fetchInto
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.ModellingGroupRecord
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.SplitData

class JooqModellingGroupRepository(
        dsl: DSLContext,
        private val touchstoneRepository: TouchstoneRepository,
        private val scenarioRepository: ScenarioRepository
) : JooqRepository(dsl), ModellingGroupRepository
{

    override fun getModellingGroups(): Iterable<ModellingGroup>
    {
        return dsl.select(MODELLING_GROUP.fieldsAsList())
                .from(MODELLING_GROUP)
                .where(MODELLING_GROUP.REPLACED_BY.isNull)
                .fetchInto<ModellingGroupRecord>()
                .map { mapModellingGroup(it) }
    }

    override fun getModellingGroup(id: String): ModellingGroup
    {
        // This is a little confusing.
        // The modelling_group table has a self-referential foreign key called 'current'.
        // If the modelling group's ID need to change (e.g. the group moves to another
        // institution) we insertInto a new row with the new ID. The old row remains, and
        // has current set to point at the new ID. If we change the ID again, we update
        // all the old rows to point at the most recent one.

        // So this join says: Get me the group with the specified ID, but if current is
        // not null, this must be an old row so join current to ID and get the row it
        // points at instead.
        val t1 = MODELLING_GROUP.`as`("t1")
        val t2 = MODELLING_GROUP.`as`("t2")
        val record = dsl.select(t1.REPLACED_BY, t1.ID, t1.DESCRIPTION, t2.ID, t2.DESCRIPTION)
                .from(t1)
                .leftJoin(t2).on(t1.REPLACED_BY.eq(t2.ID))
                .where(t1.ID.eq(id))
                .fetchAny()
        if (record != null)
        {
            if (record.value1() == null)
            {
                return ModellingGroup(record.value2(), record.value3())
            }
            else
            {
                return ModellingGroup(record.value4(), record.value5())
            }
        }
        else
        {
            throw UnknownObjectError(id, "ModellingGroup")
        }
    }

    override fun getModellingGroupDetails(groupId: String): ModellingGroupDetails
    {
        val group = getModellingGroup(groupId)
        val models = dsl.select(MODEL.fieldsAsList())
                .from(MODEL)
                .where(MODEL.IS_CURRENT)
                .and(MODEL.MODELLING_GROUP.eq(group.id))
                .fetch()
                .map { ResearchModel(it[MODEL.ID], it[MODEL.DESCRIPTION], it[MODEL.CITATION], group.id) }
        val users = dsl.select(APP_USER.USERNAME)
                .fromJoinPath(APP_USER, USER_ROLE, ROLE)
                .where(ROLE.NAME.eq("member"))
                .and(ROLE.SCOPE_PREFIX.eq("modelling-group"))
                .and(USER_ROLE.SCOPE_ID.eq(group.id))
                .fetch()
                .map { it[APP_USER.USERNAME] }
        return ModellingGroupDetails(group.id, group.description, models, users)
    }

    override fun getResponsibilities(groupId: String, touchstoneId: String,
                                     scenarioFilterParameters: ScenarioFilterParameters): ResponsibilitiesAndTouchstoneStatus
    {
        getModellingGroup(groupId)
        val touchstone = getTouchstone(touchstoneId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneId)
        val responsibilities = getResponsibilities(responsibilitySet, scenarioFilterParameters, touchstoneId)
        return ResponsibilitiesAndTouchstoneStatus(responsibilities, touchstone.status)
    }

    override fun getResponsibility(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityAndTouchstone
    {
        getModellingGroup(groupId)
        val touchstone = getTouchstone(touchstoneId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneId)
        if (responsibilitySet != null)
        {
            val responsibility = getResponsibilitiesInResponsibilitySet(
                    responsibilitySet,
                    { this.and(SCENARIO_DESCRIPTION.ID.eq(scenarioId)) }
            ).singleOrNull() ?: throw UnknownObjectError(scenarioId, "responsibility")
            return ResponsibilityAndTouchstone(touchstone, responsibility)
        }
        else
        {
            throw UnknownObjectError(scenarioId, "responsibility")
        }
    }

    override fun getCoverageSets(groupId: String, touchstoneId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
    {
        // We don't use the returned responsibility, but by using this method we check that the group exists
        // and that the group is responsible for the given scenario in the given touchstone
        val responsibilityAndTouchstone = getResponsibility(groupId, touchstoneId, scenarioId)
        val scenario = touchstoneRepository.getScenario(touchstoneId, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstone,
                scenario.scenario,
                scenario.coverageSets)
    }

    override fun getCoverageData(groupId: String, touchstoneId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, LongCoverageRow>
    {
        val responsibilityAndTouchstone = getResponsibility(groupId, touchstoneId, scenarioId)
        val scenarioAndData = touchstoneRepository.getScenarioAndCoverageData(touchstoneId, scenarioId)
        return SplitData(ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstone,
                scenarioAndData.structuredMetadata.scenario,
                scenarioAndData.structuredMetadata.coverageSets
        ), scenarioAndData.tableData)
    }

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
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM)
                .select(
                        table.UPLOADED_ON,
                        table.UPLOADED_BY,
                        table.SET_TYPE,
                        table.SET_TYPE_DETAILS,
                        table.ID
                )
                .fromJoinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(RESPONSIBILITY)
                .on(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET.eq(BURDEN_ESTIMATE_SET.ID))
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
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
        val uploadedOn = first[BURDEN_ESTIMATE_SET.UPLOADED_ON].toInstant()
        return BurdenEstimateSet(
                id = first[BURDEN_ESTIMATE_SET.ID],
                uploadedBy = first[BURDEN_ESTIMATE_SET.UPLOADED_BY],
                uploadedOn = uploadedOn,
                type = mapper.mapBurdenEstimateSetType(first),
                problems = input.filter { it[BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] != null }
                        .map { it[BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM] }
        )
    }

    private fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                                    scenarioFilterParameters: ScenarioFilterParameters,
                                    touchstoneId: String): Responsibilities
    {
        if (responsibilitySet != null)
        {
            val responsibilities = getResponsibilitiesInResponsibilitySet(
                    responsibilitySet,
                    { this.whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters) }
            )
            val status = mapper.mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return Responsibilities(touchstoneId, "", status, responsibilities)
        }
        else
        {
            return Responsibilities(touchstoneId, "", null, emptyList())
        }
    }

    private fun getResponsibilitiesInResponsibilitySet(
            responsibilitySet: ResponsibilitySetRecord,
            applyWhereFilter: SelectConditionStep<Record2<String, Int>>.() -> SelectConditionStep<Record2<String, Int>>)
            : List<Responsibility>
    {
        val records = dsl
                .select(SCENARIO_DESCRIPTION.ID, RESPONSIBILITY.ID)
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySet.id))
                .applyWhereFilter()
                .fetch()
                .intoMap(SCENARIO_DESCRIPTION.ID)

        val scenarioIds = records.keys
        val scenarios = scenarioRepository.getScenarios(scenarioIds)
        return scenarios.map {
            convertScenarioToResponsibility(it, records[it.id]!![RESPONSIBILITY.ID])
        }
    }

    private fun getResponsibilitySet(groupId: String, touchstoneId: String): ResponsibilitySetRecord?
    {
        return dsl.fetchAny(RESPONSIBILITY_SET,
                RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId)))
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.description)

    private fun getTouchstone(touchstoneId: String) = touchstoneRepository.touchstones.get(touchstoneId)
}