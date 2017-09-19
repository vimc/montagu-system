package org.vaccineimpact.api.tests.mocks

import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory

class MockRepositoryFactory(val repositories: Repositories) : RepositoryFactory()
{
    override fun <T> inTransaction(work: (Repositories) -> T): T
    {
        return work(repositories)
    }
}

fun Repositories.asFactory() = MockRepositoryFactory(this)