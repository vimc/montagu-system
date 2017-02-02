package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup

@Suppress("Unused")
class ViewModellingGroupEstimateListing(group: ModellingGroup, estimates: Iterable<ImpactEstimate>) {
    val group = ViewModellingGroupMetadata(group)
    val estimates = estimates.map(::ViewImpactEstimateMetadata).toList()
}