package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.db.JooqContext
import java.time.Instant

class JooqAccessLogRepository(db: JooqContext) : JooqRepository(db), AccessLogRepository
{
    override fun log(principal: String?, timestamp: Instant, resource: String)
    {
        dsl.newRecord(API_ACCESS_LOG)l
    }
}