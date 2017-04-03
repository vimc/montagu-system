package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.app.models.Responsibility
import org.vaccineimpact.api.app.models.ResponsibilitySetStatus
import org.vaccineimpact.api.app.models.ResponsibilityStatus
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
            assertThat(set.touchstone).isEqualTo("touchstone-1")
            assertThat(set.status).isNull()
            assertThat(set.problems).isEmpty()
            assertThat(set).isEmpty()
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
            assertThat(set.touchstone).isEqualTo("touchstone-1")
            assertThat(set.status).isEqualTo(ResponsibilitySetStatus.INCOMPLETE)
            assertThat(set.problems).isEmpty()
            assertThat(set).isEmpty()
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
            assertThat(set.touchstone).isEqualTo("touchstone-1")
            assertThat(set.status).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
            assertThat(set.problems).isEmpty()
            assertThat(set).hasSameElementsAs(listOf(
                    Responsibility(
                            Scenario("scenario-1", "description 1", "disease 1", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY,
                            emptyList(),
                            null
                    ),
                    Responsibility(
                            Scenario("scenario-2", "description 2", "disease 2", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY,
                            emptyList(),
                            null
                    )
            ))
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
            val group1Set = it.addResponsibilitySet("group1", "touchstone-1", "submitted", addStatus = true)
            val group2Set = it.addResponsibilitySet("group2", "touchstone-1", "incomplete", addStatus = true)
            it.addResponsibility(group1Set, "touchstone-1", "scenario-1")
            it.addResponsibility(group2Set, "touchstone-1", "scenario-2")
        } check { repo ->
            val set = repo.getResponsibilities("group1", "touchstone-1", ScenarioFilterParameters())
            assertThat(set.touchstone).isEqualTo("touchstone-1")
            assertThat(set.status).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
            assertThat(set.problems).isEmpty()
            assertThat(set.responsibilities).hasSameElementsAs(listOf(
                    Responsibility(
                            Scenario("scenario-1", "description 1", "disease 1", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY,
                            emptyList(),
                            null
                    )
            ))
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

            // Both scenarios appear in both touchstones - but the group is only responsible for
            // scenario 1 in touchstone 1, and scenario 2 in touchstone 2
            it.addResponsibility(set1, "touchstone-1", "scenario-1")
            it.addResponsibility(set2, "touchstone-2", "scenario-2")
            it.addScenario("touchstone-1", "scenario-2")
            it.addScenario("touchstone-2", "scenario-1")
        } check { repo ->
            val set = repo.getResponsibilities("group", "touchstone-1", ScenarioFilterParameters())
            assertThat(set.touchstone).isEqualTo("touchstone-1")
            assertThat(set.status).isEqualTo(ResponsibilitySetStatus.SUBMITTED)
            assertThat(set.problems).isEmpty()
            assertThat(set).hasSameElementsAs(listOf(
                    Responsibility(
                            Scenario("scenario-1", "description 1", "disease 1", listOf(
                                    "touchstone-1",
                                    "touchstone-2"
                            )),
                            ResponsibilityStatus.EMPTY,
                            emptyList(),
                            null
                    )
            ))
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
                    Responsibility(
                            Scenario("scenario-2", "description 2", "disease 2", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY,
                            emptyList(),
                            null
                    )
            ))
        }
    }
}