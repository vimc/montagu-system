package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.*

interface ModellingGroupRepository
{
    val modellingGroups: DataSet<ModellingGroup, Int>

    fun getModellingGroupByCode(groupCode: String): ModellingGroup

    fun getModels(groupCode: String): List<VaccineModel>
    fun getResponsibilities(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): Responsibilities
    fun getEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing
    fun getEstimate(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup
    fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup
}