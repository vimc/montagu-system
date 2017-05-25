package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository

abstract class ModellingGroupRepositoryTests : org.vaccineimpact.api.databaseTests.RepositoryTests<ModellingGroupRepository>()
{
    override fun makeRepository(): org.vaccineimpact.api.app.repositories.ModellingGroupRepository
    {
        val scenarioRepository = { org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository() }
        val touchstoneRepository = { org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository(scenarioRepository) }
        return org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository(touchstoneRepository, scenarioRepository)
    }
}