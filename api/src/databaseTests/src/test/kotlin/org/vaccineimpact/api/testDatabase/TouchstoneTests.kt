package org.vaccineimpact.api.testDatabase

import org.junit.Test
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests

class TouchstoneTests : RepositoryTests<TouchstoneRepository>()
{
    override fun makeRepository(): TouchstoneRepository
    {
        val scenarioRepository = { JooqScenarioRepository() }
        return JooqTouchstoneRepository(scenarioRepository)
    }

    @Test
    fun `can fetch scenarios in touchstone`()
    {
        TODO()
    }

    @Test
    fun `can fetch scenarios with coverage sets`()
    {
        TODO()
    }

    @Test
    fun `coverage sets are returned in order`()
    {
        TODO()
    }

    @Test
    fun `scenarios from other touchstones are not returned`()
    {
        TODO()
    }

    @Test
    fun `can filter by scenario`()
    {
        TODO()
    }
}