package org.vaccineimpact.api.app.repositories.jooq

import java.io.Closeable

abstract class JooqRepository : Closeable
{
    private val context = JooqContext()
    val dsl = context.dsl

    override fun close()
    {
        context.close()
    }
}