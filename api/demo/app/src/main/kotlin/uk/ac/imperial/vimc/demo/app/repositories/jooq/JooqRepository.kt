package uk.ac.imperial.vimc.demo.app.repositories.jooq

open abstract class JooqRepository
{
    val dsl
        get() = JooqContext().dsl
}