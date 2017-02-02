package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ModellingGroup

@Suppress("Unused")
class ModellingGroupAndEstimateListing(group: ModellingGroup) {
    val group = ModellingGroupMetadata(group)
    val estimates = group.estimates.map(::ImpactEstimateMetadata).toList()
}