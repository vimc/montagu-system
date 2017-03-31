package org.vaccineimpact.api.databaseTests

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.db.Tables.*

abstract class ModellingGroupRepositoryTests : DatabaseTest()
{
    protected fun given(populateDatabase: (JooqContext) -> Unit)
            : RepositoryTestContext<ModellingGroupRepository>
    {
        JooqContext().use { populateDatabase(it) }
        return RepositoryTestContext(this::makeRepository)
    }

    protected fun givenABlankDatabase(): RepositoryTestContext<ModellingGroupRepository>
    {
        return RepositoryTestContext(this::makeRepository)
    }

    private fun makeRepository(): ModellingGroupRepository
    {
        return JooqModellingGroupRepository({ JooqTouchstoneRepository() })
    }
}