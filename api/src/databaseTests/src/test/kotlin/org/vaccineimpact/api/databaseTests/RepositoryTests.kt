package org.vaccineimpact.api.databaseTests

import org.vaccineimpact.api.app.repositories.Repository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.test_helpers.DatabaseTest

abstract class RepositoryTests<TRepository : Repository> : DatabaseTest()
{
    protected fun given(populateDatabase: (JooqContext) -> Unit)
            : RepositoryTestConfig<TRepository>
    {
        return RepositoryTestConfig(this::makeRepository, populateDatabase = populateDatabase)
    }

    protected fun givenABlankDatabase(): RepositoryTestConfig<TRepository>
    {
        return RepositoryTestConfig(this::makeRepository, populateDatabase = {})
    }

    protected fun <T> withDatabase(doThis: (JooqContext) -> T): T
    {
        return JooqContext().use { doThis(it) }
    }

    protected fun <T> withRepo(doThis: (TRepository) -> T): T
    {
        return JooqContext().use {
            val repo = makeRepository(it)
            doThis(repo)
        }
    }

    protected abstract fun makeRepository(db: JooqContext): TRepository
}