package org.vaccineimpact.api.app.repositories

import org.bouncycastle.util.IPAddress
import java.time.Instant

interface AccessLogRepository : Repository
{
    fun log(principal: String?, timestamp: Instant, resource: String, responseStatus: Int, ipAddress: String)
}