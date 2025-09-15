package org.vaccineimpact.api.app.filters

import org.vaccineimpact.api.app.context.ActionContext

data class ScenarioFilterParameters(val scenarioId: String? = null,
                                    val disease: String? = null)
{
    companion object
    {
        fun fromContext(context: ActionContext): ScenarioFilterParameters =
                ScenarioFilterParameters(
                        context.queryParams("scenario_id"),
                        context.queryParams("disease")
                )
    }
}