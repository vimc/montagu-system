package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext

abstract class ModellingGroupRepositoryTests : RepositoryTests<ModellingGroupRepository>()
{
    override fun makeRepository(db: JooqContext): ModellingGroupRepository
    {
        val scenarioRepository = JooqScenarioRepository(db)
        val touchstoneRepository = JooqTouchstoneRepository(db, scenarioRepository)
        return JooqModellingGroupRepository(db, touchstoneRepository, scenarioRepository)
    }
}