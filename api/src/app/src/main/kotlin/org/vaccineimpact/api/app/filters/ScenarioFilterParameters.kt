package org.vaccineimpact.api.app.filters

import spark.Request

data class ScenarioFilterParameters(val scenarioId: String? = null,
                                    val disease: String? = null)
{
    companion object
    {
        fun fromRequest(req: Request): ScenarioFilterParameters =
                ScenarioFilterParameters(
                        req.queryParams("scenario_id"),
                        req.queryParams("disease")
                )
    }
}