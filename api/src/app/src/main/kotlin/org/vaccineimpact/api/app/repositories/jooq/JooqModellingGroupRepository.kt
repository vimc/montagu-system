package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record1
import org.jooq.SelectConditionStep
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fetchInto
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.ModellingGroupRecord
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.models.*

class JooqModellingGroupRepository(
        db: JooqContext,
        private val touchstoneRepository: TouchstoneRepository,
        private val scenarioRepository: ScenarioRepository
)
    : JooqRepository(db), ModellingGroupRepository
{
    override fun getModellingGroups(): Iterable<ModellingGroup>
    {
        return dsl.select(MODELLING_GROUP.fieldsAsList())
                .from(MODELLING_GROUP)
                .where(MODELLING_GROUP.CURRENT.isNull)
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
        val record = dsl.select(t1.CURRENT, t1.ID, t1.DESCRIPTION, t2.ID, t2.DESCRIPTION)
                .from(t1)
                .leftJoin(t2).on(t1.CURRENT.eq(t2.ID))
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
                .where(MODEL.CURRENT.isNull)
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
            val scenario = getScenariosInResponsibilitySet(
                    responsibilitySet,
                    { this.and(SCENARIO_DESCRIPTION.ID.eq(scenarioId)) }
            ).singleOrNull() ?: throw UnknownObjectError(scenarioId, "responsibility")
            val responsibility = convertScenarioToResponsibility(scenario)
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

    override fun getCoverageData(groupId: String, touchstoneId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, CoverageRow>
    {
        val responsibilityAndTouchstone = getResponsibility(groupId, touchstoneId, scenarioId)
        val scenarioAndData = touchstoneRepository.getScenarioAndCoverageData(touchstoneId, scenarioId)
        return SplitData(ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstone,
                scenarioAndData.structuredMetadata.scenario,
                scenarioAndData.structuredMetadata.coverageSets
        ), scenarioAndData.tableData)
    }

    private fun convertScenarioToResponsibility(scenario: Scenario): Responsibility
    {
        return Responsibility(scenario, ResponsibilityStatus.EMPTY, emptyList(), null)
    }

    private fun getResponsibilities(responsibilitySet: ResponsibilitySetRecord?,
                                    scenarioFilterParameters: ScenarioFilterParameters,
                                    touchstoneId: String): Responsibilities
    {
        if (responsibilitySet != null)
        {
            val scenarios = getScenariosInResponsibilitySet(
                    responsibilitySet,
                    { this.whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters) }
            )
            val responsibilities = scenarios.map(this::convertScenarioToResponsibility)
            val status = mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return Responsibilities(touchstoneId, "", status, responsibilities)
        }
        else
        {
            return Responsibilities(touchstoneId, "", null, emptyList())
        }
    }

    private fun getScenariosInResponsibilitySet(
            responsibilitySet: ResponsibilitySetRecord,
            applyWhereFilter: SelectConditionStep<Record1<String>>.() -> SelectConditionStep<Record1<String>>)
            : List<Scenario>
    {
        val records = dsl
                .select(SCENARIO_DESCRIPTION.ID)
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySet.id))
                .applyWhereFilter()
                .fetch()
        val scenarioIds = records.map { it.getValue(SCENARIO_DESCRIPTION.ID) }
        return scenarioRepository.getScenarios(scenarioIds)
    }

    private fun getResponsibilitySet(groupId: String, touchstoneId: String): ResponsibilitySetRecord?
    {
        return dsl.fetchAny(RESPONSIBILITY_SET,
                RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId)))
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.description)

    private fun getTouchstone(touchstoneId: String) = touchstoneRepository.touchstones.get(touchstoneId)
}