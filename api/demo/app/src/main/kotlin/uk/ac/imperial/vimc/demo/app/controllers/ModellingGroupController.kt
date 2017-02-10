package uk.ac.imperial.vimc.demo.app.controllers

import com.github.salomonbrys.kotson.fromJson
import spark.Request
import spark.Response
import uk.ac.imperial.vimc.demo.app.Serializer
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository

class ModellingGroupController(private val db: ModellingGroupRepository) {
    fun getAllModellingGroups(req: Request, res: Response): List<ModellingGroup> {
        return db.modellingGroups.all().toList()
    }

    fun getModellingGroup(req: Request, res: Response): ModellingGroup {
        return db.getModellingGroupByCode(groupCode(req))
    }

    fun getModels(req: Request, res: Response): List<VaccineModel> {
        return db.getModels(groupCode(req))
    }

    fun getResponsibilities(req: Request, res: Response): Responsibilities {
        val filterParameters = ScenarioFilterParameters.fromRequest(req)
        return db.getResponsibilities(groupCode(req), filterParameters)
    }

    fun getAllEstimates(req: Request, res: Response): ModellingGroupEstimateListing {
        val filterParameters = ScenarioFilterParameters.fromRequest(req)
        return db.getEstimateListing(groupCode(req), filterParameters)
    }

    fun getEstimate(req: Request, res: Response): ImpactEstimateDataAndGroup {
        val estimateId = req.params(":estimate-id").toInt()
        return db.getEstimate(groupCode = groupCode(req), estimateId = estimateId)
    }

    fun createEstimate(req: Request, res: Response): ImpactEstimateDataAndGroup {
        val data = Serializer.gson.fromJson<NewImpactEstimate>(req.body())
        val estimate = db.createEstimate(groupCode(req), data)
        res.status(201)
        return estimate
    }

    // We are sure that this will be non-null, as its part of the URL, and Spark wouldn't have mapped us here
    // if it were blank
    private fun groupCode(req: Request): String = req.params(":group-Code")
}