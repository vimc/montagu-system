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
                .from(Tables.RESPONSIBLITY)
                .join(Tables.COVERAGE_SCENARIO).onKey()
                .join(Tables.COVERAGE_SCENARIO_DESCRIPTION).onKey()
                .where(Tables.RESPONSIBLITY.RESPONSIBILITY_SET.eq(responsibility_set.id))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetchInto<CoverageScenarioDescriptionRecord>()
                .map { JooqScenarioRepository.scenarioMapper(it) }
                .map(::Responsibility)
        return Responsibilities(group, scenarios, responsibility_set.complete)
    }

    override fun getEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getEstimate(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.code, x.description)
}