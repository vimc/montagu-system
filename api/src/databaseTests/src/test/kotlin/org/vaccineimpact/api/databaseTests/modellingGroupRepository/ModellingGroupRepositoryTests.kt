package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests

abstract class ModellingGroupRepositoryTests : RepositoryTests<ModellingGroupRepository>()
{
    override fun makeRepository(): ModellingGroupRepository
    {
        val scenarioRepository = { JooqScenarioRepository() }
        val touchstoneRepository = { JooqTouchstoneRepository(scenarioRepository) }
        return JooqModellingGroupRepository(touchstoneRepository, scenarioRepository)
    }
}