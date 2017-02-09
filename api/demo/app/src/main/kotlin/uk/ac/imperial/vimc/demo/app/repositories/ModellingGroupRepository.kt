package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDataAndGroup
import uk.ac.imperial.vimc.demo.app.models.ModellingGroupEstimateListing
import uk.ac.imperial.vimc.demo.app.models.NewImpactEstimate

interface ModellingGroupRepository {
    val modellingGroups: DataSet<ModellingGroup, String>
    fun getModellingGroupEstimateListing(groupId: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing
    fun getEstimateForGroup(groupId: String, estimateId: Int): ImpactEstimateDataAndGroup
    fun createEstimate(groupId: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup
}