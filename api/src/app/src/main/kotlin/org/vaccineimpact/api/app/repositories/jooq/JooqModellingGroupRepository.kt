package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.extensions.fetchInto
import org.vaccineimpact.api.app.extensions.fieldsAsList
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.models.*
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.tables.records.ModellingGroupRecord
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import java.util.*

class JooqModellingGroupRepository(
        private val touchstoneRepository: () -> TouchstoneRepository,
        private val scenarioRepository: () -> ScenarioRepository
)
    : JooqRepository(), ModellingGroupRepository
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

    override fun getResponsibilities(groupId: String, touchstoneId: String,
                                     scenarioFilterParameters: ScenarioFilterParameters): Responsibilities
    {
        getModellingGroup(groupId)
        touchstoneRepository().use { it.touchstones.assertExists(touchstoneId) }
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneId)
        if (responsibilitySet != null)
        {
            val responsibilities = getScenariosInResponsibilitySet(responsibilitySet, scenarioFilterParameters)
                    .map { Responsibility(it, ResponsibilityStatus.EMPTY, emptyList(), null) }
            val status = mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return Responsibilities(touchstoneId, "", status, responsibilities)
        }
        else
        {
            return Responsibilities(touchstoneId, "", null, emptyList())
        }
    }

    private fun getScenariosInResponsibilitySet(responsibilitySet: ResponsibilitySetRecord,
                                                scenarioFilterParameters: ScenarioFilterParameters): List<Scenario>
    {
        val records = dsl
                .select(SCENARIO_DESCRIPTION.ID)
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySet.id))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetch()
        val scenarioIds = records.map { it.getValue(SCENARIO_DESCRIPTION.ID) }
        return scenarioRepository().use {
            it.getScenarios(scenarioIds)
        }
    }

    private fun getResponsibilitySet(groupId: String, touchstoneId: String): ResponsibilitySetRecord?
    {
        return dsl.fetchAny(RESPONSIBILITY_SET,
                RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId)))
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.description)
    private inline fun <reified T : Enum<T>> mapEnum(name: String): T
    {
        return EnumSet.allOf(T::class.java)
                .firstOrNull { name.equals(it.name, ignoreCase = true) }
                ?: throw BadDatabaseConstant(name, T::class.simpleName ?: "[unknown]")
    }
}