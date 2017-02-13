package uk.ac.imperial.vimc.demo.app.filters

import spark.Request

data class ScenarioFilterParameters(val scenarioId: String?,
                                    val disease: String?,
                                    val vaccine: String?,
                                    val vaccinationLevel: String?,
                                    val scenarioType: String?)
{
    companion object
    {
        fun fromRequest(req: Request): ScenarioFilterParameters =
                ScenarioFilterParameters(
                        req.queryParams("scenario_id"),
                        req.queryParams("disease"),
                        req.queryParams("vaccine"),
                        req.queryParams("vaccination_level"),
                        req.queryParams("scenario_type")
                )
    }
}