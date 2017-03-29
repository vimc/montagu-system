package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.app.models.ErrorInfo

class UnknownObjectError(id: Any, typeName: Any) : MontaguError(404, listOf(
        ErrorInfo("unknown-${typeName.toString().toLowerCase()}", "Unknown $typeName with id '$id'")
))
