package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.models.ModellingGroup
import org.vaccineimpact.api.app.models.ResponsibilitySetStatus
import org.vaccineimpact.api.app.models.Scenario
import org.vaccineimpact.api.db.direct.*

class ResponsibilityTests : ModellingGroupRepositoryTests()
{
    @Test
    fun `getResponsibilities throws error for unknown modelling group`()
    {
        given {
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters()) }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("modelling-group")
        }
    }

    @Test
    fun `getResponsibilities checks that touchstone exists`()
    {
        given {
            it.addGroup("group", "description")
        } check { repo ->
            assertThatThrownBy { repo.getResponsibilities("group", "touchstone", ScenarioFilterParameters()) }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("touchstone")
        }
    }

    @Test
    fun `getResponsibilities returns empty responsibility set when group has no responsibilities`()
    {
        given {
            it.addGroup("group", "description")
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).isEmpty()
            assertThat(set.group).isEqualTo(ModellingGroup("group", "description"))
            assertThat(set.responsibilitySetStatus).isNull()
        }
    }

    @Test
    fun `getResponsibilities returns empty responsibility set when group has empty responsibilities`()
    {
        given {
            it.addGroup("group", "description")
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            it.addResponsibilitySet("group", "touchstone-1", "incomplete", addStatus = true)
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).isEmpty()
            assertThat(set.group).isEqualTo(ModellingGroup("group", "description"))
            assertThat(set.responsibilitySetStatus).isEqualTo(ResponsibilitySetStatus.INCOMPLETE)
        }
    }


    @Test
    fun `can get responsibilities`()
    {
        given {
            it.addGroup("group", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addScenarioDescription("scenario-2", "description 2", "disease 2", addDisease = true)
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            val setId = it.addResponsibilitySet("group", "touchstone-1", "submitted", addStatus = true)
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
            it.addResponsibility(setId, "touchstone-1", "scenario-2")
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).hasSameElementsAs(listOf(
                    Scenario("scenario-1", "description 1", "disease 1"),
                    Scenario("scenario-2", "description 2", "disease 2")
            ))
            assertThat(set.group).isEqualTo(ModellingGroup("group", "description"))
            assertThat(set.responsibilitySetStatus).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
        }
    }

    @Test
    fun `responsibilities from other groups are not returned`()
    {
        given {
            it.addGroup("group1", "description")
            it.addGroup("group2", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addScenarioDescription("scenario-2", "description 2", "disease 2", addDisease = true)
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            val set1 = it.addResponsibilitySet("group1", "touchstone-1", "submitted", addStatus = true)
            val set2 = it.addResponsibilitySet("group2", "touchstone-1", "incomplete", addStatus = true)
            it.addResponsibility(set1, "touchstone-1", "scenario-1")
            it.addResponsibility(set2, "touchstone-1", "scenario-2")
        } check { repo ->
            val set = repo.getResponsibilities("group1", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).hasSameElementsAs(listOf(
                    Scenario("scenario-1", "description 1", "disease 1")
            ))
            assertThat(set.group).isEqualTo(ModellingGroup("group1", "description"))
            assertThat(set.responsibilitySetStatus).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
        }
    }

    @Test
    fun `responsibilities from other touchstones are not returned`()
    {
        given {
            it.addGroup("group", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addScenarioDescription("scenario-2", "description 2", "disease 2", addDisease = true)
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            it.addTouchstone("touchstone", 2, "status", 1900..2000)
            val set1 = it.addResponsibilitySet("group", "touchstone-1", "submitted", addStatus = true)
            val set2 = it.addResponsibilitySet("group", "touchstone-2", "incomplete", addStatus = true)
            it.addResponsibility(set1, "touchstone-1", "scenario-1")
            it.addResponsibility(set2, "touchstone-2", "scenario-2")
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).hasSameElementsAs(listOf(
                    Scenario("scenario-1", "description 1", "disease 1")
            ))
            assertThat(set.group).isEqualTo(ModellingGroup("group", "description"))
            assertThat(set.responsibilitySetStatus).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
        }
    }

    @Test
    fun `can filter responsibilities by disease`()
    {
        given {
            it.addGroup("group", "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease 1", addDisease = true)
            it.addScenarioDescription("scenario-2", "description 2", "disease 2", addDisease = true)
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            val setId = it.addResponsibilitySet("group", "touchstone-1", "submitted", addStatus = true)
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
            it.addResponsibility(setId, "touchstone-1", "scenario-2")
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set).hasSize(2)
            val filteredSet = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters(
                    disease = "disease 2"
            ))
            assertThat(filteredSet).hasSameElementsAs(listOf(
                    Scenario("scenario-2", "description 2", "disease 2")
            ))
        }
    }
}