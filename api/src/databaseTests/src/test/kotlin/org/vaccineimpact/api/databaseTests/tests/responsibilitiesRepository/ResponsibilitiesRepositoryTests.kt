package org.vaccineimpact.api.databaseTests.tests.responsibilitiesRepository

import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext

abstract class ResponsibilitiesRepositoryTests : RepositoryTests<ResponsibilitiesRepository>()
{
    override fun makeRepository(db: JooqContext): ResponsibilitiesRepository
    {
        val scenarioRepository = JooqScenarioRepository(db.dsl)
        val touchstoneRepository = JooqTouchstoneRepository(db.dsl, scenarioRepository)
        return JooqResponsibilitiesRepository(db.dsl, scenarioRepository,
                touchstoneRepository)
  }
}