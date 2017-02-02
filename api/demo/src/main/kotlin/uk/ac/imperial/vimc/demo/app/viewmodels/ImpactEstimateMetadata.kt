package uk.ac.imperial.vimc.demo.app.viewmodels

import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate

@Suppress("Unused")
class ImpactEstimateMetadata(x: ImpactEstimate) {
    val id = x.id
    val scenario = ScenarioMetadata(x.scenario)
    val modelVersion = x.modelVersion
    val dateUploaded = x.dateUploaded
}