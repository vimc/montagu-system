package org.vaccineimpact.api.databaseTests

import java.io.Closeable

class RepositoryTestContext<out TRepository: Closeable>(
        private val makeRepository: () -> TRepository
)
{
    infix fun check(withRepository: (TRepository) -> Unit)
    {
        makeRepository().use { withRepository(it) }
    }
}