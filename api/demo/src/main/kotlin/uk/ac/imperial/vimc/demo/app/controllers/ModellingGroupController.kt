package uk.ac.imperial.vimc.demo.app.controllers

import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.models.StaticModellingGroups
import uk.ac.imperial.vimc.demo.app.viewmodels.ImpactEstimateAndGroup
import uk.ac.imperial.vimc.demo.app.viewmodels.ModellingGroupAndEstimateListing
import uk.ac.imperial.vimc.demo.app.viewmodels.ModellingGroupMetadata

class ModellingGroupController {
    fun getAllModellingGroups(req: Request, res: Response): List<ModellingGroupMetadata> {
        return StaticModellingGroups.all.map(::ModellingGroupMetadata)
    }
    fun getAllEstimates(req: Request, res: Response): ModellingGroupAndEstimateListing {
        val id = req.params(":id")
        val group = StaticModellingGroups.all.single { it.id == id }
        return ModellingGroupAndEstimateListing(group)
    }
    fun getEstimate(req: Request, res: Response): ImpactEstimateAndGroup {
        val id = req.params(":id")
        val group = StaticModellingGroups.all.single { it.id == id }
        val estimateId = req.params(":estimate-id").toInt()
        val estimate = group.estimates.single { it.id == estimateId }
        return ImpactEstimateAndGroup(group, estimate)
    }
}