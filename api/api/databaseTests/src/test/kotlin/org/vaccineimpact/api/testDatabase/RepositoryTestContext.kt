package org.vaccineimpact.api.testDatabase

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