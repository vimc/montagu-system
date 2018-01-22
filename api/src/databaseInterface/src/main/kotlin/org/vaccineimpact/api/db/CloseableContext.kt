package org.vaccineimpact.api.db

import org.jooq.DSLContext

// The idea is that we need a database context, and in some cases we
// want to close the database connection as soon as we're done (a
// short-lived context) and in others we're just using a pre-existing
// database context from an outer scope, and we should just leave it
// open. This interface abstracts away those distinctions.
interface CloseableContext
{
    fun inside(work: (DSLContext) -> Unit)
}

// Just pass the DSL through, don't close it
class AmbientDSLContext(val dsl: DSLContext) : CloseableContext
{
    override fun inside(work: (DSLContext) -> Unit)
    {
        work(dsl)
    }
}

// Open a new database connection as needed, and then close it again
class ShortlivedAnnexContext : CloseableContext
{
    override fun inside(work: (DSLContext) -> Unit)
    {
        AnnexJooqContext().use {
            work(it.dsl)
        }
    }
}