package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ModelRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModelRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.ActivityType
import org.vaccineimpact.api.models.TouchstoneStatus


class ScenarioTests : RepositoryTests<ScenarioRepository>()
{
    override fun makeRepository(db: JooqContext): ScenarioRepository = JooqScenarioRepository(db.dsl)

    private val groupId = "group-1"
    private val touchstoneId = "touchstone-1"

    @Test
    fun `scenarios are returned in order of activity type`()
    {
        withDatabase {
            setUp(it)
        }
        withRepo {
            val scenarios = it.getScenarios(listOf("scenario-1", "scenario-2", "scenario-3"))
            assertThat(scenarios.count()).isEqualTo(3)
            assertThat(scenarios[0].description).isEqualTo("none")
            assertThat(scenarios[1].description).isEqualTo("routine")
            assertThat(scenarios[2].description).isEqualTo("campaign")
        }
    }

    private fun setUp(db: JooqContext)
    {
        db.addUserForTesting("model.user")
        db.addGroup(groupId, "description")

        db.addScenarioDescription("scenario-1", "routine", "disease-1", addDisease = true)
        db.addScenarioDescription("scenario-2", "none", "disease-1", addDisease = false)
        db.addScenarioDescription("scenario-3", "campaign", "disease-1", addDisease = false)

        db.addTouchstone("touchstone", 1, "description", "open", addName = true)
        db.addScenarioToTouchstone(touchstoneId, "scenario-1")
        db.addScenarioToTouchstone(touchstoneId, "scenario-2")
        db.addScenarioToTouchstone(touchstoneId, "scenario-3")

        val c1= db.addCoverageSet(touchstoneId, "coverage name", "v1", "with",
                "routine", addVaccine = true)
        val c2 = db.addCoverageSet(touchstoneId, "coverage name", "v1", "with",
                "none", addVaccine = false)
        val c3 = db.addCoverageSet(touchstoneId, "coverage name", "v1", "with",
                "campaign", addVaccine = false)

        db.addFocalCoverageSetToScenario("scenario-1", touchstoneId, c1, 0)
        db.addFocalCoverageSetToScenario("scenario-2", touchstoneId, c2, 0)
        db.addFocalCoverageSetToScenario("scenario-3", touchstoneId, c3, 0)
    }
}