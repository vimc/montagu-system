package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class ModelOwnershipError(modelName: String, actionAttempted: String) : VimcError(403, listOf(
        ErrorInfo("not-your-model", "Attempted to $actionAttempted for model '$modelName', " +
                "but this model belongs to another modelling group.")
))