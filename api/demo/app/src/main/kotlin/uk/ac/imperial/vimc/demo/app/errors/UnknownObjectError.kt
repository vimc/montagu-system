package uk.ac.imperial.vimc.demo.app.errors

import uk.ac.imperial.vimc.demo.app.models.ErrorInfo

class UnknownObjectError(id: Any, typeName: Any) : VimcError(404, listOf(
        ErrorInfo("unknown-${typeName.toString().toLowerCase()}", "Unknown $typeName with id '$id'")
))
