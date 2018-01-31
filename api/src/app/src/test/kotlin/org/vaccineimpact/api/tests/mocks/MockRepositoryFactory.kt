package org.vaccineimpact.api.tests.mocks

import com.nhaarman.mockito_kotlin.mock
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory

class MockRepositoryFactory(val repositories: Repositories) : RepositoryFactory()
{
    override fun <T> inTransaction(work: (Repositories) -> T): T
    {
        return work(repositories)
    }
}

class MockRepositories(private val reposInTransaction: Repositories = mock()) : Repositories(mock())
{
    override fun <T> inTransaction(work: (Repositories) -> T): T
    {
        return work(reposInTransaction)
    }
}

fun Repositories.asFactory() = MockRepositoryFactory(this)