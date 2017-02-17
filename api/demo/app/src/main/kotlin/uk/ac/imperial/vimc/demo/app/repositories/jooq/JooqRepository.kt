package uk.ac.imperial.vimc.demo.app.repositories.jooq

import java.io.Closeable

open abstract class JooqRepository : Closeable
{
    private val context = JooqContext()
    val dsl = context.dsl

    override fun close()
    {
        context.close()
    }
}