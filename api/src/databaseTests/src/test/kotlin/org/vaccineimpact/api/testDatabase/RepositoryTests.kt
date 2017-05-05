package org.vaccineimpact.api.databaseTests

import org.vaccineimpact.api.app.repositories.Repository
import org.vaccineimpact.api.databaseTests.RepositoryTestContext
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.test_helpers.DatabaseTest

abstract class RepositoryTests<TRepository: Repository> : DatabaseTest()
{
    protected fun given(populateDatabase: (JooqContext) -> Unit)
        : RepositoryTestContext<TRepository>
    {
        JooqContext().use { populateDatabase(it) }
        return RepositoryTestContext(this::makeRepository)
    }

    protected fun givenABlankDatabase(): RepositoryTestContext<TRepository>
    {
        return RepositoryTestContext(this::makeRepository)
    }

    protected abstract fun makeRepository(): TRepository
}