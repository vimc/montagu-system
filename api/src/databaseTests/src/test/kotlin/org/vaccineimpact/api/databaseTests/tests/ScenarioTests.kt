package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*


class ScenarioTests : RepositoryTests<ScenarioRepository>()
{
    override fun makeRepository(db: JooqContext): ScenarioRepository = JooqScenarioRepository(db.dsl)

    private val groupId = "group-1"
    private val touchstoneVersionId = "touchstone-1"

    @Test
    fun `scenarios are returned in order of disease, then activity type`()
    {
        val disease1 = "disease-abc"
        val disease2 = "disease-def"
        withDatabase {
            setUp(it)
            setUpDisease(it, disease2)
            setUpDisease(it, disease1)
        }
        withRepo {
            val scenarios = it.getScenarios(listOf("scenario-3$disease1", "scenario-1$disease1",
                    "scenario-2$disease1", "scenario-2$disease2","scenario-1$disease2",
                    "scenario-3$disease2"))

            assertThat(scenarios.count()).isEqualTo(6)
            assertThat(scenarios[0].description).isEqualTo("none")
            assertThat(scenarios[0].disease).isEqualTo(disease1)
            assertThat(scenarios[1].description).isEqualTo("routine")
            assertThat(scenarios[1].disease).isEqualTo(disease1)
            assertThat(scenarios[2].description).isEqualTo("campaign")
            assertThat(scenarios[2].disease).isEqualTo(disease1)

            assertThat(scenarios[3].description).isEqualTo("none")
            assertThat(scenarios[3].disease).isEqualTo(disease2)
            assertThat(scenarios[4].description).isEqualTo("routine")
            assertThat(scenarios[4].disease).isEqualTo(disease2)
            assertThat(scenarios[5].description).isEqualTo("campaign")
            assertThat(scenarios[5].disease).isEqualTo(disease2)
        }
    }

    private fun setUp(db: JooqContext)
    {
        db.addUserForTesting("model.user")
        db.addGroup(groupId, "description")
        db.addTouchstoneVersion("touchstone", 1, "description", "open", addTouchstone = true)
    }

    private fun setUpDisease(db: JooqContext, diseaseId: String)
    {
        db.addScenarioDescription("scenario-1$diseaseId", "routine", diseaseId, addDisease = true)
        db.addScenarioDescription("scenario-3$diseaseId", "campaign", diseaseId, addDisease = false)
        db.addScenarioDescription("scenario-2$diseaseId", "none", diseaseId, addDisease = false)

        db.addScenarioToTouchstone(touchstoneVersionId, "scenario-2$diseaseId")
        db.addScenarioToTouchstone(touchstoneVersionId, "scenario-3$diseaseId")
        db.addScenarioToTouchstone(touchstoneVersionId, "scenario-1$diseaseId")

        val c1 = db.addCoverageSet(touchstoneVersionId, "coverage name", "v1$diseaseId", "with",
                "routine", addVaccine = true)
        val c2 = db.addCoverageSet(touchstoneVersionId, "coverage name", "v1$diseaseId", "with",
                "none", addVaccine = false)
        val c3 = db.addCoverageSet(touchstoneVersionId, "coverage name", "v1$diseaseId", "with",
                "campaign", addVaccine = false)

        db.addFocalCoverageSetToScenario("scenario-1$diseaseId", touchstoneVersionId, c1, 0)
        db.addFocalCoverageSetToScenario("scenario-2$diseaseId", touchstoneVersionId, c2, 0)
        db.addFocalCoverageSetToScenario("scenario-3$diseaseId", touchstoneVersionId, c3, 0)
    }
}