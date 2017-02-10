package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDataAndGroup
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.ModellingGroupEstimateListing
import uk.ac.imperial.vimc.demo.app.models.NewImpactEstimate

interface ModellingGroupRepository {
    val modellingGroups: DataSet<ModellingGroup, Int>

    fun getModellingGroupByCode(groupCode: String): ModellingGroup
    fun getModellingGroupEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing
    fun getEstimateForGroup(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup
    fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup
}