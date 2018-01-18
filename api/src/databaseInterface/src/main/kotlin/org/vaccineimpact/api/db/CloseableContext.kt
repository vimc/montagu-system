package org.vaccineimpact.api.db

import org.jooq.DSLContext

interface CloseableContext
{
    fun inside(work: (DSLContext) -> Unit)
}

class AmbientDSLContext(val dsl: DSLContext) : CloseableContext
{
    override fun inside(work: (DSLContext) -> Unit)
    {
        work(dsl)
    }
}

open class ShortlivedAnnexContext : CloseableContext
{
    override open fun inside(work: (DSLContext) -> Unit)
    {
        AnnexJooqContext().use {
            work(it.dsl)
        }
    }
}