package org.vaccineimpact.api.app.repositories

import java.time.Instant

interface AccessLogRepository : Repository
{
    fun log(principal: String?, timestamp: Instant, resource: String)
}