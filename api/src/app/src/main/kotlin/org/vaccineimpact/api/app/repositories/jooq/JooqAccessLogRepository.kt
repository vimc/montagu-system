package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.API_ACCESS_LOG
import java.sql.Timestamp
import java.time.Instant

class JooqAccessLogRepository(db: JooqContext) : JooqRepository(db), AccessLogRepository
{
    override fun log(principal: String?, timestamp: Instant, resource: String, responseStatus: Int, ipAddress: String)
    {
        dsl.newRecord(API_ACCESS_LOG).apply {
            this.who = principal
            this.timestamp = Timestamp.from(timestamp)
            this.what = resource
            this.result = responseStatus
            this.ipAddress = ipAddress
        }.insert()
    }
}