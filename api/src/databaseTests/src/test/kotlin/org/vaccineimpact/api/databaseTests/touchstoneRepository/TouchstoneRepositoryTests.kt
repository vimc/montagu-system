package org.vaccineimpact.api.databaseTests.touchstoneRepository

import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addScenarioDescription
import org.vaccineimpact.api.db.direct.addTouchstone
import org.vaccineimpact.api.db.direct.addVaccine

abstract class TouchstoneRepositoryTests : RepositoryTests<TouchstoneRepository>()
{
    val touchstoneName = "touchstone"
    val touchstoneVersion = 1
    val touchstoneId = "$touchstoneName-$touchstoneVersion"
    val scenarioId = "yf-1"

    override fun makeRepository(db: JooqContext): TouchstoneRepository
    {
        val scenarioRepository = JooqScenarioRepository(db.dsl)
        return JooqTouchstoneRepository(db.dsl, scenarioRepository)
    }

    protected fun createTouchstoneAndScenarioDescriptions(it: JooqContext)
    {
        it.addTouchstone(touchstoneName, touchstoneVersion, addName = true)
        it.addDisease("YF", "Yellow Fever")
        it.addDisease("Measles", "Measles")
        it.addScenarioDescription(scenarioId, "Yellow Fever 1", "YF")
        it.addScenarioDescription("yf-2", "Yellow Fever 2", "YF")
        it.addScenarioDescription("ms-1", "Measles 1", "Measles")
        it.addScenarioDescription("ms-2", "Measles 2", "Measles")
        it.addVaccine("YF", "Yellow Fever")
        it.addVaccine("Measles", "Measles")
    }
}