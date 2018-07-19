package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import com.opencsv.CSVReader
import com.sun.org.apache.xpath.internal.operations.Bool
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest
import java.io.StringReader
import java.math.BigDecimal

class ResponsibilityTests : DatabaseTest()
{
    private val touchstoneVersionId = "touchstone-1"
    private val groupId = "awesome-group"
    private val groupScope = "modelling-group:$groupId"
    private val scenarioId = "yf-scenario"
    private val modelId = "model-1"

    val responsibilityUrl = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/"

    @Test
    fun `getResponsibilities matches schema`()
    {
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/") against "ResponsibilitySet" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            assertThat(it["touchstone_version"]).isEqualTo(touchstoneVersionId)
            assertThat(it["status"]).isEqualTo("submitted")
            assertThat(it["problems"]).isEqualTo("")

            @Suppress("UNCHECKED_CAST")
            val responsibilities = it["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to
                                "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            assertThat(responsibility["status"]).isEqualTo("invalid")
            assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    @Test
    fun `not-applicable status is returned when there are no responsibilities`()
    {
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/") against "ResponsibilitySet" given {
            addUserGroupAndTouchstone(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone_version" to touchstoneVersionId,
                        "status" to "not-applicable",
                        "problems" to "",
                        "responsibilities" to array()
                )
            })
        }
    }

    @Test
    fun `can get touchstones by group id`()
    {
        validate("/modelling-groups/$groupId/responsibilities/") against "Touchstones" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("*/touchstones.read", "$groupScope/responsibilities.read")
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(
                        obj(
                                "id" to "touchstone",
                                "description" to "description",
                                "comment" to "comment",
                                "versions" to array(obj(
                                        "id" to touchstoneVersionId,
                                        "name" to "touchstone",
                                        "version" to 1,
                                        "description" to "version description",
                                        "status" to "open"
                                ))
                        )
                )
            })
        }
    }

    @Test
    fun `only touchstone preparer can see in-preparation responsibilities`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/"
        val minimumPermissions = PermissionSet("*/can-login", "$groupScope/responsibilities.read", "*/scenarios.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone-version", touchstoneVersionId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    @Test
    fun `getResponsibility matches schema`()
    {
        validate(responsibilityUrl) against "ResponsibilityDetails" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read")
        } andCheck {
            val touchstoneVersion = it["touchstone_version"] as JsonObject
            val responsibility = it["responsibility"] as JsonObject
            val scenario = responsibility["scenario"] as JsonObject
            assertThat(touchstoneVersion).isEqualTo(json {
                obj(
                        "id" to touchstoneVersionId,
                        "name" to "touchstone",
                        "version" to 1,
                        "description" to "version description",
                        "status" to "open"
                )
            })

            assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            assertThat(responsibility["status"]).isEqualTo("invalid")
            assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    @Test
    fun `can get expectations with responsibility`()
    {
        val expectationsId: Int = JooqContext().use { db ->
            val responsibilityId = addResponsibilities(db, touchstoneStatus = "open", includeExpectations = false)
            db.addCountries(listOf("A", "B"))
            val id = db.addExpectations(
                    responsibilityId,
                    yearMinInclusive = 2000, yearMaxInclusive = 2100,
                    ageMinInclusive = 0, ageMaxInclusive = 99,
                    cohortMinInclusive = null, cohortMaxInclusive = 2050,
                    countries = listOf("A", "B"),
                    outcomes = listOf("deaths", "dalys")
            )
            TestUserHelper().setupTestUser(db)
            id
        }
        val permissions = PermissionSet("$groupScope/responsibilities.read", "*/scenarios.read", "*/can-login")
        val response = RequestHelper().get(responsibilityUrl, permissions)
        val data = response.montaguData<JsonObject>()!!
        assertThat(data["expectations"]).isEqualTo(json {
            obj(
                    "id" to expectationsId,
                    "years" to obj("minimum_inclusive" to 2000, "maximum_inclusive" to 2100),
                    "ages" to obj("minimum_inclusive" to 0, "maximum_inclusive" to 99),
                    "cohorts" to obj("minimum_birth_year" to null, "maximum_birth_year" to 2050),
                    "countries" to array(
                            obj("id" to "A", "name" to "A-Name"),
                            obj("id" to "B", "name" to "B-Name")
                    ),
                    "outcomes" to array("deaths", "dalys")
            )
        })
    }

    @Test
    fun `only touchstone-preparer can see in-preparation responsibility`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/"
        val minimumPermissions = PermissionSet("*/can-login", "$groupScope/responsibilities.read", "*/scenarios.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone-version", touchstoneVersionId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    @Test
    fun `get coverage sets matches schema`()
    {
        val coverageSetId = 1
        validate("/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/coverage-sets/") against "ScenarioAndCoverageSets" given {
            addResponsibilities(it, touchstoneStatus = "open")
            it.addCoverageSet(touchstoneVersionId, "coverage set name", "vaccine-1", "without", "routine", coverageSetId,
                    addVaccine = true)
            it.addCoverageSetToScenario(scenarioId, touchstoneVersionId, coverageSetId, 0)
        } requiringPermissions {
            PermissionSet("*/scenarios.read", "$groupScope/responsibilities.read", "$groupScope/coverage.read")
        } andCheck {
            assertThat(it).isEqualTo(json {
                obj(
                        "touchstone_version" to obj(
                                "id" to touchstoneVersionId,
                                "name" to "touchstone",
                                "version" to 1,
                                "description" to "version description",
                                "status" to "open"
                        ),
                        "scenario" to obj(
                                "id" to scenarioId,
                                "touchstones" to array(touchstoneVersionId),
                                "description" to "description 1",
                                "disease" to "disease-1"
                        ),
                        "coverage_sets" to array(obj(
                                "id" to coverageSetId,
                                "touchstone_version" to touchstoneVersionId,
                                "name" to "coverage set name",
                                "vaccine" to "vaccine-1",
                                "gavi_support" to "no gavi",
                                "activity_type" to "routine"
                        ))
                )
            })
        }
    }

    @Test
    fun `get template has correct headers`()
    {
        val userHelper = TestUserHelper()
        val requestHelper = RequestHelper()

        JooqContext().use {
            val id = addResponsibilities(it, touchstoneStatus = "open")
            it.addExpectations(id, outcomes = listOf("deaths", "dalys"))
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/template/",
                PermissionSet("*/can-login", "*/scenarios.read", "$groupScope/responsibilities.read"), acceptsContentType = "text/csv")

        val csv = StringReader(response.text)
                .use { CSVReader(it).readAll() }

        val headers = csv.first().toList()

        val expectedHeaders = listOf("disease", "year", "age", "country", "country_name",
                "cohort_size", "deaths", "dalys")

        expectedHeaders.forEachIndexed { index, h ->
            Assertions.assertThat(h).isEqualTo(headers[index])
        }

    }

    @Test
    fun `only touchstone preparer can see in-preparation coverage sets`()
    {
        val url = "/modelling-groups/$groupId/responsibilities/$touchstoneVersionId/$scenarioId/coverage-sets/"
        val minimumPermissions = PermissionSet("*/can-login", "*/scenarios.read", "$groupScope/responsibilities.read", "$groupScope/coverage.read")
        val permissionUnderTest = "*/touchstones.prepare"
        val checker = PermissionChecker(url, minimumPermissions + permissionUnderTest)
        checker.checkPermissionIsRequired(
                permissionUnderTest,
                expectedProblem = ExpectedProblem("unknown-touchstone-version", touchstoneVersionId),
                given = { addResponsibilities(it, touchstoneStatus = "in-preparation") }
        )
    }

    @Test
    fun `can get responsibilities for touchstone`()
    {
        validate("/touchstones/$touchstoneVersionId/responsibilities/") against "ResponsibilitySets" given {
            addResponsibilities(it, touchstoneStatus = "open")
        } requiringPermissions {
            PermissionSet("*/touchstones.read", "*/responsibilities.read", "*/scenarios.read")
        } andCheckArray {
            val responsibilitySet = it[0] as JsonObject
            assertThat(responsibilitySet["touchstone_version"]).isEqualTo(touchstoneVersionId)
            assertThat(responsibilitySet["status"]).isEqualTo("submitted")
            assertThat(responsibilitySet["problems"]).isNull()
            assertThat(responsibilitySet["modelling_group_id"]).isEqualTo(groupId)

            @Suppress("UNCHECKED_CAST")
            val responsibilities = responsibilitySet["responsibilities"] as JsonArray<JsonObject>
            val responsibility = responsibilities[0]
            val scenario = responsibility["scenario"]
            assertThat(scenario).isEqualTo(json {
                obj(
                        "id" to scenarioId,
                        "description" to
                                "description 1",
                        "disease" to "disease-1",
                        "touchstones" to array("touchstone-1")
                )
            })
            assertThat(responsibility["status"]).isEqualTo("invalid")
            assertThat(responsibility["problems"]).isEqualTo(json { array("problem") })
            assertThat(responsibility["current_estimate_set"]).isNotNull()
        }
    }

    private fun addUserGroupAndTouchstone(db: JooqContext, touchstoneStatus: String)
    {
        db.addUserForTesting("model.user")
        db.addGroup(groupId, "description")
        db.addScenarioDescription(scenarioId, "description 1", "disease-1", addDisease = true)
        db.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        db.addTouchstone("touchstone", "description", "comment")
        db.addTouchstoneVersion("touchstone", 1, "version description", touchstoneStatus)
    }

    private fun addResponsibilities(db: JooqContext, touchstoneStatus: String, includeExpectations: Boolean = true): Int
    {
        addUserGroupAndTouchstone(db, touchstoneStatus)
        val setId = db.addResponsibilitySet(groupId, touchstoneVersionId, "submitted")
        val responsibilityId = db.addResponsibility(setId, touchstoneVersionId, scenarioId)
        db.addResponsibility(setId, touchstoneVersionId, "scenario-2")
        db.addModel(modelId, groupId, "disease-1")
        val version = db.addModelVersion(modelId, "version-1")
        val burdenEstimateId = db.addBurdenEstimateSet(responsibilityId, version, "model.user")
        db.updateCurrentEstimate(responsibilityId, burdenEstimateId)
        db.addBurdenEstimateProblem("problem", burdenEstimateId)
        if (includeExpectations)
        {
            db.addExpectations(responsibilityId)
        }

        return responsibilityId
    }

}