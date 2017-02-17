package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class ScenarioOutsideResponsibilityError(scenarioId: String, groupCode: String)
    : VimcError(400, listOf(ErrorInfo("scenario-outside-responsibility", formatMessage(scenarioId, groupCode))))
{
    companion object
    {
        fun formatMessage(scenarioId: String, groupCode: String): String
        {
            return "Attempted to upload impact estimates for scenario '$scenarioId', " +
                    "but we weren't expecting modelling group '$groupCode' to do so. " +
                    "If you are sure you should be able to upload " +
                    "data for this scenario, please contact Tini Garske."
        }
    }
}