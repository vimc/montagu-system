
import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ModellingGroupTests : DatabaseTest()
{
    @Test
    fun `getModellingGroups matches schema`()
    {
        validate("/modelling-groups/") against "ModellingGroups" given {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        } andCheckArray {
            assertThat(it).isEqualTo(json { array(
                    obj("id" to "a", "description" to "description a"),
                    obj("id" to "b", "description" to "description b")
            )})
        }
    }

    @Test
    fun `getResponsibilities matches schema`()
    {
        val group = "groupId"
        val touchstone = "touchstone-1"
        validate("/modelling-groups/$group/responsibilities/$touchstone/") against "ResponsibilitySet" given {
            it.addGroup(group, "description")
            it.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
            it.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
            it.addTouchstone("touchstone", 1, "status", 1900..2000, addName = true, addStatus = true)
            val setId = it.addResponsibilitySet(group, touchstone, "submitted", addStatus = true)
            it.addResponsibility(setId, touchstone, "scenario-1")
            it.addResponsibility(setId, touchstone, "scenario-2")
        } andCheck {
            assertThat(it["touchstone"]).isEqualTo(touchstone)
            assertThat(it["status"]).isEqualTo("submitted")
            assertThat(it["problems"]).isEqualTo("")

            val responsibilities = it["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            assertThat(scenario).isEqualTo(json { obj(
                    "id" to "scenario-1",
                    "description" to
                    "description 1",
                    "disease" to "disease-1",
                    "touchstones" to array("touchstone-1")
            )})
            assertThat(responsibility["status"]).isEqualTo("empty")
            assertThat(responsibility["problems"]).isEqualTo(json { array() })
            assertThat(responsibility["current_estimate"]).isEqualTo(null)
        }
    }
}