package org.vaccineimpact.api.databaseTests

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.testDatabase.RepositoryTests

abstract class ModellingGroupRepositoryTests : RepositoryTests<ModellingGroupRepository>()
{
    override fun makeRepository(): ModellingGroupRepository
    {
        return JooqModellingGroupRepository(
                { JooqTouchstoneRepository() },
                { JooqScenarioRepository() }
        )
    }
}