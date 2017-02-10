package uk.ac.imperial.vimc.demo.app.repositories.jooq

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDataAndGroup
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.ModellingGroupEstimateListing
import uk.ac.imperial.vimc.demo.app.models.NewImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.ModellingGroupRecord
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository

class JooqModellingGroupRepository : JooqRepository(), ModellingGroupRepository {
    override val modellingGroups: DataSet<ModellingGroup, Int>
        get() = JooqDataSet.new(dsl, Tables.MODELLING_GROUP, { it.ID }, this::mapModellingGroup)

    override fun getModellingGroupByCode(groupCode: String): ModellingGroup {
        val record = dsl.fetchAny(Tables.MODELLING_GROUP, Tables.MODELLING_GROUP.CODE.eq(groupCode))
                ?: throw UnknownObject(groupCode, ModellingGroup::class.simpleName!!)
        return mapModellingGroup(record)
    }

    override fun getModellingGroupEstimateListing(groupId: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getEstimateForGroup(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.code, x.description)
}