package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.errors.UnableToConnectToDatabaseError
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.UnableToConnectToDatabase
import java.io.Closeable

abstract class JooqRepository : Closeable
{
    private val context = makeContext()
    val dsl = context.dsl

    override fun close()
    {
        context.close()
    }

    private fun makeContext(): JooqContext
    {
        try
        {
            return JooqContext()
        }
        catch (e: UnableToConnectToDatabase)
        {
            throw UnableToConnectToDatabaseError(e.url)
        }
    }
}