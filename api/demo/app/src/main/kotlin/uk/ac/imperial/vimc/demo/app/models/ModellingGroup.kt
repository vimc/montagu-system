package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.repositories.Repository

class ModellingGroup(val id: String, val description: String, estimates: Iterable<ImpactEstimate>): HasKey<String> {
    override val key: String = id
    val estimates = estimates.toMutableList()

    companion object {
        fun newEstimateId(repository: Repository): Int {
            val highestId = repository.modellingGroups.all().map {
                g -> g.estimates.map { e -> e.id }.max() ?: 0
            }.max() ?: 0
            return highestId + 1
        }
    }
}