package uk.ac.imperial.vimc.demo.app.controllers

import com.github.salomonbrys.kotson.fromJson
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.Serializer
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilter
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimate
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.StaticModellingGroups
import uk.ac.imperial.vimc.demo.app.viewmodels.ImpactEstimateDataAndGroup
import uk.ac.imperial.vimc.demo.app.viewmodels.NewImpactEstimate
import uk.ac.imperial.vimc.demo.app.viewmodels.ViewModellingGroupEstimateListing
import uk.ac.imperial.vimc.demo.app.viewmodels.ViewModellingGroupMetadata

class ModellingGroupController {
    fun getAllModellingGroups(req: Request, res: Response): List<ViewModellingGroupMetadata> {
        return StaticModellingGroups.all.map(::ViewModellingGroupMetadata)
    }

    fun getAllEstimates(req: Request, res: Response): ViewModellingGroupEstimateListing {
        val group = getGroup(req)
        val filters = ScenarioFilter.adaptedFor<ImpactEstimate> { it.scenario }
        val estimates = filters.apply(group.estimates, req)
        return ViewModellingGroupEstimateListing(group, estimates)
    }

    fun getEstimate(req: Request, res: Response): ImpactEstimateDataAndGroup {
        val group = getGroup(req)
        val estimateId = req.params(":estimate-id").toInt()
        val estimate = group.estimates.single { it.id == estimateId }
        return ImpactEstimateDataAndGroup(group, estimate)
    }

    fun createEstimate(req: Request, res: Response): ImpactEstimateDataAndGroup {
        val group = getGroup(req)
        val data = Serializer.gson.fromJson<NewImpactEstimate>(req.body())
        val estimate = data.toEstimate(group)
        res.status(201)
        return ImpactEstimateDataAndGroup(group, estimate)
    }

    private fun getGroup(req: Request): ModellingGroup {
        val id = req.params(":group-id")
        return StaticModellingGroups.all.single { it.id == id }
    }
}