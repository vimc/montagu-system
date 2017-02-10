package uk.ac.imperial.vimc.demo.app.repositories.jooq

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.extensions.fetchInto
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.filters.whereMatchesFilter
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.CoverageScenarioDescriptionRecord
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.ModelRecord
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.ModellingGroupRecord
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository
import java.time.Instant

class JooqModellingGroupRepository : JooqRepository(), ModellingGroupRepository {
    override val modellingGroups: DataSet<ModellingGroup, Int>
        get() = JooqDataSet.new(dsl, Tables.MODELLING_GROUP, { it.ID }, this::mapModellingGroup)

    private fun groupHasCode(groupCode: String) = Tables.MODELLING_GROUP.CODE.eq(groupCode)

    override fun getModellingGroupByCode(groupCode: String): ModellingGroup {
        val record = dsl.fetchAny(Tables.MODELLING_GROUP, groupHasCode(groupCode))
                ?: throw UnknownObject(groupCode, ModellingGroup::class.simpleName!!)
        return mapModellingGroup(record)
    }

    override fun getModels(groupCode: String): List<VaccineModel> {
        return dsl.select()
                .from(Tables.MODEL)
                .join(Tables.MODELLING_GROUP).onKey()
                .where(groupHasCode(groupCode))
                .fetchInto<ModelRecord>()
                .map { VaccineModel(it.id, it.name, it.citation, it.description) }
    }

    override fun getResponsibilities(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): Responsibilities {
        val group = getModellingGroupByCode(groupCode)
        val responsibility_set = dsl.fetchAny(Tables.RESPONSIBILITY_SET,
                Tables.RESPONSIBILITY_SET.MODELLING_GROUP.eq(group.id))
        val scenarios = dsl
                .select(Tables.COVERAGE_SCENARIO_DESCRIPTION.fields().toList())
                .from(Tables.RESPONSIBILITY)
                .join(Tables.COVERAGE_SCENARIO).onKey()
                .join(Tables.COVERAGE_SCENARIO_DESCRIPTION).onKey()
                .where(Tables.RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibility_set.id))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetchInto<CoverageScenarioDescriptionRecord>()
                .map { JooqScenarioRepository.scenarioMapper(it) }
                .map(::Responsibility)
        return Responsibilities(group, scenarios, responsibility_set.complete)
    }

    override fun getEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        val group = getModellingGroupByCode(groupCode)
        val scenarioIdField = Tables.COVERAGE_SCENARIO_DESCRIPTION.ID
        val impactEstimates = dsl
                .select(Tables.IMPACT_ESTIMATE_SET.ID, Tables.MODEL_VERSION.VERSION, Tables.MODEL.NAME, scenarioIdField)
                .from(Tables.MODELLING_GROUP)
                .join(Tables.RESPONSIBILITY_SET).using(Tables.MODELLING_GROUP.ID)
                .join(Tables.RESPONSIBILITY).using(Tables.RESPONSIBILITY_SET.ID)
                .join(Tables.IMPACT_ESTIMATE_SET).using(Tables.IMPACT_ESTIMATE_SET.ID)
                .join(Tables.RESPONSIBILITY).onKey()
                .join(Tables.MODEL).onKey()
                .join(Tables.COVERAGE_SCENARIO).onKey()
                .join(Tables.COVERAGE_SCENARIO_DESCRIPTION).onKey()
                .where(groupHasCode(groupCode))
                .toList()
        val scenarioIds : List<String> = impactEstimates.map { it[scenarioIdField] }.toList()
        val scenarios = dsl
                .fetch(Tables.COVERAGE_SCENARIO_DESCRIPTION, scenarioIdField.`in`(scenarioIds))
                .map { JooqScenarioRepository.scenarioMapper(it) }

        val listing = impactEstimates.map {
            record ->
            ImpactEstimateDescription(
                    record[Tables.IMPACT_ESTIMATE_SET.ID],
                    scenarios.single { record[scenarioIdField] == it.id },
                    record[Tables.MODEL.NAME],
                    record[Tables.MODEL_VERSION.VERSION],
                    Instant.now()
            )
        }
        return ModellingGroupEstimateListing(group, listing)
    }

    override fun getEstimate(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.code, x.description)
}