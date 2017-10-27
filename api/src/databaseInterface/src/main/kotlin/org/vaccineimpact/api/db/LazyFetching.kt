package org.vaccineimpact.api.db

import org.jooq.Record
import org.jooq.ResultQuery

fun <TRecord: Record> ResultQuery<TRecord>.fetchSequence(): Sequence<TRecord>
{
    val cursor = this.fetchSize(100).fetchLazy()
    return generateSequence { cursor.fetchOne() }
}