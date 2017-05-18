package org.vaccineimpact.api.databaseTests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*

class GetResponsibilityTests : ModellingGroupRepositoryTests()
{
    @Test
    fun `getResponsibility throws error for unknown modelling group`()
    {
        given {
            it.addTouchstone("touchstone", 1, "description", "status", 1900..2000, addName = true, addStatus = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("modelling-group")
        }
    }

    @Test
    fun `getResponsibility checks that touchstone exists`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("touchstone")
        }
    }

    @Test
    fun `getResponsibility throws exception when group has no responsibilities`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", 1900..2000, addName = true, addStatus = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `getResponsibility throws exception when group has empty responsibilities`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", 1900..2000, addName = true, addStatus = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
            it.addResponsibilitySet("group-1", "touchstone-1", "incomplete", addStatus = true)
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-1") }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `getResponsibility throws exception when when group is not responsible for given scenario`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", 1900..2000, addName = true, addStatus = true)
            it.addDisease("disease")
            it.addScenarioDescription("scenario-1", "description", "disease")
            it.addScenarioDescription("scenario-2", "description", "disease")
            val setId = it.addResponsibilitySet("group-1", "touchstone-1", "incomplete", addStatus = true)
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
        } check { repo ->
            assertThatThrownBy { repo.getResponsibility("group-1", "touchstone-1", "scenario-2") }
                    .isInstanceOf(UnknownObjectError::class.java)
                    .hasMessageContaining("responsibility")
        }
    }

    @Test
    fun `can get responsibility`()
    {
        given {
            it.addGroup("group-1", "description")
            it.addTouchstone("touchstone", 1, "description", "open", 1900..2000, addName = true, addStatus = true)
            it.addScenarioDescription("scenario-1", "description", "disease", addDisease = true)
            val setId = it.addResponsibilitySet("group-1", "touchstone-1", "incomplete", addStatus = true)
            it.addResponsibility(setId, "touchstone-1", "scenario-1")
        } check { repo ->
            val data = repo.getResponsibility("group-1", "touchstone-1", "scenario-1")
            assertThat(data).isEqualTo(ResponsibilityAndTouchstone(
                    Touchstone("touchstone-1", "touchstone", 1, "description", YearRange(1900, 2000), TouchstoneStatus.OPEN),
                    Responsibility(
                            Scenario("scenario-1", "description", "disease", listOf("touchstone-1")),
                            ResponsibilityStatus.EMPTY, emptyList(), null
                    )
            ))
        }
    }
}