package org.vaccineimpact.api.databaseTests.modellingGroupRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetResponsibilityTests : ModellingGroupRepositoryTests()
{
    @org.junit.Test
    fun `getResponsibility throws error for unknown modelling group`()
    {
        given {
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("modelling-group")
        }
    }

    @org.junit.Test
    fun `getResponsibility checks that touchstone exists`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("touchstone")
        }
    }

    @Test
    fun `responsibility status is invalid if burden estimate has problems`()
    {
        var burdenEstimateId = 0
        given {
            it.addUserForTesting("test.user")
            it.addGroup("group", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            val setId = it.addResponsibilitySet("group", "touchstone-1", "submitted")
            val responsibilityId = it.addResponsibility(setId, "touchstone-1", "scenario-1")
            val modelId = it.addModel("model", "group")
            val version = it.addModelVersion(modelId)
            burdenEstimateId = it.addBurdenEstimateSet(responsibilityId, version, "test.user")
            it.updateCurrentEstimate(responsibilityId, burdenEstimateId)
            it.addBurdenEstimateProblem("problem", burdenEstimateId)
        } check { repo ->
            val responsibility = repo.getResponsibility("group", "touchstone-1", "scenario-1")
                    .responsibility
            assertThat(responsibility.currentEstimate!!.id).isEqualTo(burdenEstimateId)
            assertThat(responsibility.status).isEqualTo(ResponsibilityStatus.INVALID)
        }
    }

    @Test
    fun `returns burden estimate`()
    {
        var burdenEstimateId = 0
        given {
            it.addUserForTesting("test.user")
            it.addGroup("group", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            val setId = it.addResponsibilitySet("group", "touchstone-1", "submitted")
            val responsibilityId = it.addResponsibility(setId, "touchstone-1", "scenario-1")
            val modelId = it.addModel("model", "group")
            val version = it.addModelVersion(modelId)
            burdenEstimateId = it.addBurdenEstimateSet(responsibilityId, version, "test.user")
            it.updateCurrentEstimate(responsibilityId, burdenEstimateId)
        } check { repo ->
            val responsibility = repo.getResponsibility("group", "touchstone-1", "scenario-1")
                    .responsibility
            assertThat(responsibility.currentEstimate!!.id).isEqualTo(burdenEstimateId)
            assertThat(responsibility.status).isEqualTo(ResponsibilityStatus.VALID)
            assertThat(responsibility.currentEstimate!!.uploadedOn).isNotNull()
        }
    }

    @Test
    fun `getResponsibility throws exception when group has no responsibilities`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @org.junit.Test
    fun `getResponsibility throws exception when group has empty responsibilities`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
            it.addResponsibilitySet("group-1", "touchstone-1", "incomplete")
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @org.junit.Test
    fun `getResponsibility throws exception when when group is not responsible for given scenario`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            it.addDisease("disease")
            it.addScenarioDescription("scenario-1", "description", "disease")
            it.addScenarioDescription("scenario-2", "description", "disease")
            val setId = it.addResponsibilitySet("group-1", "touchstone-1", "incomplete")
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-2") }
                    .isInstanceOf(org.vaccineimpact.api.app.errors.UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @org.junit.Test
    fun `can get responsibility`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", addName = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
            val setId = it.addResponsibilitySet("group-1", "touchstone-1", "incomplete")
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
        } check { repo ->
            val data = repo.getResponsibility("group-1", "touchstone-1", "scenario-1")
            assertThat(data).isEqualTo(org.vaccineimpact.api.models.ResponsibilityAndTouchstone(
                    Touchstone("touchstone-1", "touchstone", 1, "description", TouchstoneStatus.OPEN),
                    Responsibility(
                            Scenario("scenario-1", "description", "disease", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY, emptyList(), null
                    )
            ))
        }
    }
}