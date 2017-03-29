package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.app.extensions.fetchInto
import org.vaccineimpact.api.app.extensions.fieldsAsList
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.filters.whereMatchesFilter
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.models.Responsibilities
import org.vaccineimpact.api.app.models.ResponsibilitySetStatus
import org.vaccineimpact.api.app.models.Scenario
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.tables.records.ModellingGroupRecord
import org.vaccineimpact.api.db.tables.records.ResponsibilitySetRecord
import org.vaccineimpact.api.db.tables.records.ScenarioDescriptionRecord
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqSimpleDataSet
import java.util.*

class JooqModellingGroupRepository(private val touchstoneRepository: () -> TouchstoneRepository)
    : JooqRepository(), ModellingGroupRepository
{
    override val modellingGroups: SimpleDataSet<ModellingGroup, String>
        get() = JooqSimpleDataSet.new(dsl, MODELLING_GROUP, { it.ID }, this::mapModellingGroup)

    override fun getResponsibilities(groupId: String, touchstoneId: String,
                                     scenarioFilterParameters: ScenarioFilterParameters): Responsibilities
    {
        val group = modellingGroups.get(groupId)
        touchstoneRepository().touchstones.assertExists(touchstoneId)
        val responsibilitySet = getResponsibilitySet(groupId, touchstoneId)
        if (responsibilitySet != null)
        {
            val scenarios = getScenariosInResponsibilitySet(responsibilitySet, scenarioFilterParameters)
            val status = mapEnum<ResponsibilitySetStatus>(responsibilitySet.status)
            return Responsibilities(group, scenarios, status)
        } else
        {
            return Responsibilities(group, emptyList(), null)
        }
    }

    private fun getScenariosInResponsibilitySet(responsibilitySet: ResponsibilitySetRecord,
                                                scenarioFilterParameters: ScenarioFilterParameters): List<Scenario>
    {
        return dsl
                .select(SCENARIO_DESCRIPTION.fieldsAsList())
                .fromJoinPath(RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibilitySet.id))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetchInto<ScenarioDescriptionRecord>()
                .map { JooqScenarioRepository.mapScenario(it) }
                .toList()
    }

    private fun getResponsibilitySet(groupId: String, touchstoneId: String): ResponsibilitySetRecord?
    {
        val responsibility_set: ResponsibilitySetRecord? = dsl.fetchAny(RESPONSIBILITY_SET,
                RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId).and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId)))
        return responsibility_set
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.description)
    private inline fun <reified T : Enum<T>> mapEnum(name: String): T
    {
        return EnumSet.allOf(T::class.java)
                .firstOrNull { name.equals(it.name, ignoreCase = true) }
                ?: throw BadDatabaseConstant(name, T::class.simpleName ?: "[unknown]")
    }
}