package uk.ac.imperial.vimc.demo.app.repositories.jooq

open class JooqRepository(context: JooqContext) {
    protected val dsl = context.dsl
}