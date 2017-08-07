package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo

class ValidationError(errors: List<ErrorInfo>) : MontaguError(400, errors)