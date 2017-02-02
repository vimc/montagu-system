package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup

@Suppress("Unused")
class ModellingGroupAndEstimateListing(group: ModellingGroup, estimates: Iterable<ImpactEstimate>) {
    val group = ModellingGroupMetadata(group)
    val estimates = estimates.map(::ImpactEstimateMetadata).toList()
}