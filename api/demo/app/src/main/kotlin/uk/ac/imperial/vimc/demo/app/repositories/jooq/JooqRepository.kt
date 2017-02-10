package uk.ac.imperial.vimc.demo.app.repositories.jooq

open class JooqRepository {
    val dsl
        get() = JooqContext().dsl
}