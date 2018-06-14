package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
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
        private val responsibilitiesRepository: ResponsibilitiesRepository,
        private val touchstoneRepository: TouchstoneRepository
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
                .fromJoinPath(APP_USER, USER_GROUP_MEMBERSHIP, USER_GROUP, USER_GROUP_ROLE, ROLE)
                .where(ROLE.NAME.eq("member"))
                .and(ROLE.SCOPE_PREFIX.eq("modelling-group"))
                .and(USER_GROUP_ROLE.SCOPE_ID.eq(group.id))
                .fetch()
                .map { it[APP_USER.USERNAME] }
        return ModellingGroupDetails(group.id, group.description, models, users)
    }

    override fun getCoverageSets(groupId: String, touchstoneVersionId: String, scenarioId: String): ScenarioTouchstoneAndCoverageSets
    {
        getModellingGroup(groupId)
        // We don't use the returned responsibility, but by using this method we check that the group exists
        // and that the group is responsible for the given scenario in the given touchstoneVersion
        val responsibilityAndTouchstone = responsibilitiesRepository.getResponsibility(groupId, touchstoneVersionId, scenarioId)
        val scenario = touchstoneRepository.getScenario(touchstoneVersionId, scenarioId)
        return ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstoneVersion,
                scenario.scenario,
                scenario.coverageSets)
    }

    override fun getCoverageData(groupId: String, touchstoneVersionId: String, scenarioId: String): SplitData<ScenarioTouchstoneAndCoverageSets, LongCoverageRow>
    {
        getModellingGroup(groupId)
        val responsibilityAndTouchstone = responsibilitiesRepository.getResponsibility(groupId, touchstoneVersionId, scenarioId)
        val scenarioAndData = touchstoneRepository.getScenarioAndCoverageData(touchstoneVersionId, scenarioId)
        return SplitData(ScenarioTouchstoneAndCoverageSets(
                responsibilityAndTouchstone.touchstoneVersion,
                scenarioAndData.structuredMetadata.scenario,
                scenarioAndData.structuredMetadata.coverageSets
        ), scenarioAndData.tableData)
    }

    override fun getTouchstonesByGroupId(groupId: String): List<Touchstone>
    {
        val group = getModellingGroup(groupId)
        return dsl
                .selectDistinct(TOUCHSTONE_NAME.fieldsAsList() + TOUCHSTONE.fieldsAsList())
                .fromJoinPath(TOUCHSTONE_NAME, TOUCHSTONE, RESPONSIBILITY_SET, RESPONSIBILITY)
                .where(RESPONSIBILITY.IS_OPEN).orNot(TOUCHSTONE.STATUS.eq("open"))
                .and(RESPONSIBILITY_SET.MODELLING_GROUP.eq(group.id))
                .fetch()
                .groupBy { it[TOUCHSTONE_NAME.ID] }
                .map { touchstoneRepository.mapTouchstone(it.value) }
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.description)

    private fun getTouchstoneVersion(touchstoneVersionId: String) = touchstoneRepository.touchstoneVersions.get(touchstoneVersionId)
}