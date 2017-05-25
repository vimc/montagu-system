package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

abstract class TouchstoneRepositoryTests : RepositoryTests<TouchstoneRepository>()
{
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneId = "$touchstoneName-$touchstoneVersion"

    override fun makeRepository(): TouchstoneRepository
    {
        val scenarioRepository = { JooqScenarioRepository() }
        return JooqTouchstoneRepository(scenarioRepository)
    }

    protected fun createTouchstoneAndScenarioDescriptions(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true, addStatus = true)
        it.addDisease("YF", "Yellow Fever")
        it.addDisease("Measles", "Measles")
        it.addScenarioDescription("yf-1", "Yellow Fever 1", "YF")
        it.addScenarioDescription("yf-2", "Yellow Fever 2", "YF")
        it.addScenarioDescription("ms-1", "Measles 1", "Measles")
        it.addScenarioDescription("ms-2", "Measles 2", "Measles")

        it.addSupportLevels("none", "without", "with")
        it.addActivityTypes("none", "routine", "campaign")
        it.addVaccine("YF", "Yellow Fever")
        it.addVaccine("Measles", "Measles")
    }
}