package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.API_ACCESS_LOG
import java.sql.Timestamp
import java.time.Instant

class JooqAccessLogRepository(db: JooqContext) : JooqRepository(db), AccessLogRepository
{
    override fun log(principal: String?, timestamp: Instant, resource: String, responseStatus: Int)
    {
        dsl.newRecord(API_ACCESS_LOG).apply {
            who = principal
            `when` = Timestamp.from(timestamp)
            what = resource
            result = responseStatus
        }.insert()
    }
}