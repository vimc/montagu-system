package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ScenarioTests : DatabaseTest()
{
    @Test
    fun `can get scenarios as they exist within a touchstone`()
    {
        val touchstoneId = "touchstone-1"
        var setId: Int = -1
        validate("/touchstones/$touchstoneId/scenarios/") against "ScenariosInTouchstone" given {
            it.addTouchstone("touchstone", 1)
            it.addScenarioDescription("scenario", "description", "disease", addDisease = true)
            val scenarioId = it.addScenario(touchstoneId, "scenario")
            setId = it.addCoverageSet(touchstoneId, "Set 1", "vaccine", "none", "routine",
                    addVaccine = true, addSupportLevel = true, addActivityType = true)
            it.addCoverageSetToScenario(scenarioId, setId, order = 0)
        } andCheck {
            assertThat(it).isEqualTo(json { obj(
                    "scenario" to obj(
                            "id" to "scenario",
                            "description" to "description",
                            "touchstones" to array("touchstone-1"),
                            "disease" to "disease"
                    ),
                    "coverage_sets" to array(obj(
                            "id" to setId,
                            "touchstone" to "touchstone-1",
                            "name" to "Set 1",
                            "vaccine" to "vaccine",
                            "gavi_support_level" to "none",
                            "activity_type" to "routine"
                    ))
            )})
        }
    }
}