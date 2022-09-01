package org.vaccineimpact.api.app.security

import org.pac4j.core.client.DirectClient
import org.vaccineimpact.api.models.ErrorInfo

interface MontaguSecurityClientWrapper
{
    val client: DirectClient
    val authorizationError: ErrorInfo
}
