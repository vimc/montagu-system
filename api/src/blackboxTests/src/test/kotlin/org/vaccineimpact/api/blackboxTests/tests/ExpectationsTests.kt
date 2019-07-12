package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ExpectationsTests : DatabaseTest()
{
    private val touchstoneVersionId = "touchstone-1"
    private val groupId = "awesome-group"
    private val groupScope = "modelling-group:$groupId"
    private val scenarioId = "yf-scenario"
    private val otherScenarioId = "hepb-scenario"
    private val otherGroupId = "other group"

    val expectationsUrl = "/expectations/"

    @Test
    fun `can get all expectations`()
    {
        validate(expectationsUrl) against "TouchstoneModelExpectations" given {
            addExpectations(it)
        } requiringPermissions {
            PermissionSet("*/responsibilities.read")
        } andCheckArray {
            Assertions.assertThat(it.count()).isEqualTo(2)

            Assertions.assertThat(it).contains(json {
                obj(
                        "touchstone_version" to touchstoneVersionId,
                        "modelling_group" to groupId,
                        "disease" to "YF",
                        "expectations" to obj(
                                "id" to 1,
                                "description" to "description",
                                "years" to obj(
                                        "minimum_inclusive" to 2000,
                                        "maximum_inclusive" to 2100
                                ),
                                "ages" to obj(
                                        "minimum_inclusive" to 0,
                                        "maximum_inclusive" to 99
                                ),
                                "cohorts" to obj(
                                    "minimum_birth_year" to null,
                                    "maximum_birth_year" to null
                                ),
                                "outcomes" to array("cases", "deaths")
                        )
                )
            })

            Assertions.assertThat(it).contains(json {
                obj(
                        "touchstone_version" to "touchstone2-2",
                        "modelling_group" to otherGroupId,
                        "disease" to "HepB",
                        "expectations" to obj(
                                "id" to 2,
                                "description" to "description",
                                "years" to obj(
                                        "minimum_inclusive" to 2000,
                                        "maximum_inclusive" to 2100
                                ),
                                "ages" to obj(
                                        "minimum_inclusive" to 0,
                                        "maximum_inclusive" to 99
                                ),
                                "cohorts" to obj(
                                        "minimum_birth_year" to null,
                                        "maximum_birth_year" to null
                                ),
                                "outcomes" to array()
                        )
                )
            })
        }
    }

    private fun addExpectations(db: JooqContext)
    {
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addTouchstoneVersion("touchstone2", 2, addTouchstone = true)
        db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
        db.addScenarioDescription(otherScenarioId, "other desc", "HepB", addDisease = true)
        db.addGroup(groupId)
        db.addGroup(otherGroupId)
        val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
        val setId2 = db.addResponsibilitySet(otherGroupId, "touchstone2-2")
        val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
        val r2 = db.addResponsibility(setId2, "touchstone2-2", otherScenarioId)
        val expId1 = db.addExpectations(r1, outcomes=listOf("deaths", "cases"))
        val expId2 = db.addExpectations(r2)
        db.addExistingExpectationsToResponsibility(r1, expId1)
        db.addExistingExpectationsToResponsibility(r2, expId2)
    }
}