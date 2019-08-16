package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqExpectationsRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.CohortRestriction
import org.vaccineimpact.api.models.expectations.ExpectationMapping
import org.vaccineimpact.api.models.expectations.TouchstoneModelExpectations
import org.vaccineimpact.api.test_helpers.exampleExpectations
import org.vaccineimpact.api.test_helpers.exampleOutcomeExpectations

class ExpectationsRepositoryTests : RepositoryTests<ExpectationsRepository>()
{
    override fun makeRepository(db: JooqContext) = JooqExpectationsRepository(db.dsl)

    private val groupId = "group"
    private val otherGroupId = "other group"
    private val disease = "YF"
    private val scenarioId = "scenario"
    private val otherScenarioId = "otherScenario"
    private val touchstoneVersionId = "touchstone-1"

    @Test
    fun `can pull basic expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    description = "desc",
                    yearMinInclusive = 2000,
                    yearMaxInclusive = 2100,
                    ageMinInclusive = 0,
                    ageMaxInclusive = 99,
                    cohortMinInclusive = null,
                    cohortMaxInclusive = null,
                    countries = emptyList(),
                    outcomes = emptyList()
            )
            responsibilityId
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId).expectation
            assertThat(result.years).isEqualTo(2000..2100)
            assertThat(result.ages).isEqualTo(0..99)
            assertThat(result.description).isEqualTo("desc")
            assertThat(result.cohorts).isEqualTo(CohortRestriction())
            assertThat(result.countries).isEmpty()
            assertThat(result.outcomes).isEmpty()
        }
    }
    @Test
    fun `can pull cohort expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    cohortMinInclusive = 2005,
                    cohortMaxInclusive = 2015
            )
            responsibilityId
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId).expectation
            assertThat(result.cohorts).isEqualTo(CohortRestriction(
                    minimumBirthYear = 2005,
                    maximumBirthYear = 2015
            ))
        }
    }

    @Test
    fun `can pull country expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addCountries(listOf("GHI", "ABC", "DEF"))
            db.addExpectations(
                    responsibilityId,
                    countries = listOf("DEF", "ABC")
            )
            responsibilityId
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId).expectation
            assertThat(result.countries).containsExactlyElementsOf(listOf(
                    Country("ABC", "ABC-Name"),
                    Country("DEF", "DEF-Name")
            ))
        }
    }

    @Test
    fun `can pull outcome expectations`()
    {
        val outcomes = listOf(Outcome("test_cases", "test cases name"),
                                            Outcome("test_deaths", "test deaths name"))

        val responsibilityId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    outcomes = outcomes
            )
            responsibilityId
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId).expectation
            assertThat(result.outcomes).hasSameElementsAs(outcomes)
        }
    }

    @Test
    fun `can pull applicable scenarios and disease`()
    {
        val expectationsId = addResponsibilityAnd { db, setId, responsibilityId ->
            val expId = db.addExpectations(responsibilityId)
            db.addScenarioDescription(otherScenarioId, "desc2", disease)
            val secondResponsibilityId = db.addResponsibility(setId, touchstoneVersionId, otherScenarioId)
            db.addExistingExpectationsToResponsibility(secondResponsibilityId, expId)
            expId
        }
        withRepo { repo ->
            val (_, scenarios, disease) = repo.getExpectationsById(expectationsId)
            assertThat(scenarios).isEqualTo(listOf(otherScenarioId, scenarioId))
            assertThat(disease).isEqualTo(disease)
        }
    }

    @Test
    fun `throws exception if not all scenarios belong to same disease`()
    {
        val expectationsId = addResponsibilityAnd { db, setId, responsibilityId ->
            val expId = db.addExpectations(responsibilityId)
            db.addScenarioDescription(otherScenarioId, "desc2", "otherDisease", addDisease = true)
            val secondResponsibilityId = db.addResponsibility(setId, touchstoneVersionId, otherScenarioId)
            db.addExistingExpectationsToResponsibility(secondResponsibilityId, expId)
            expId
        }
        withRepo { repo ->
            assertThatThrownBy { repo.getExpectationsById(expectationsId) }
                    .isInstanceOf(DatabaseContentsError::class.java)
        }
    }


    @Test
    fun `can get expectation ids for group and touchstone`()
    {
        val expectationId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addExpectations(
                    responsibilityId
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId)
            assertThat(result).hasSameElementsAs(listOf(
                    expectationId
            ))
        }
    }

    @Test
    fun `getExpectationIdsForGroupAndTouchstone only retrieves expectation ids for given group`()
    {
        val badGroupId = "badgroup"
        addResponsibilityAnd { db, _, responsibilityId ->

            db.addGroup(badGroupId)
            db.addExpectations(
                    responsibilityId
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationIdsForGroupAndTouchstone(badGroupId, touchstoneVersionId)
            assertThat(result).isEmpty()
        }
    }

    @Test
    fun `getExpectationIdsForGroupAndTouchstone only retrieves expectation ids for given touchstone`()
    {
        val badTouchstoneId = "touchstone-2"
        addResponsibilityAnd { db, _, responsibilityId ->

            db.addTouchstoneVersion("touchstone", 2)
            db.addExpectations(
                    responsibilityId
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationIdsForGroupAndTouchstone(groupId, badTouchstoneId)
            assertThat(result).isEmpty()
        }
    }

    @Test
    fun `can get expectation by id`()
    {
        val expectationId = addResponsibilityAnd { db, _, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    description = "desc",
                    yearMinInclusive = 2000,
                    yearMaxInclusive = 2100,
                    ageMinInclusive = 0,
                    ageMaxInclusive = 99,
                    cohortMinInclusive = null,
                    cohortMaxInclusive = null,
                    countries = emptyList(),
                    outcomes = emptyList()
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsById(expectationId).expectation
            assertThat(result.years).isEqualTo(2000..2100)
            assertThat(result.ages).isEqualTo(0..99)
            assertThat(result.description).isEqualTo("desc")
            assertThat(result.cohorts).isEqualTo(CohortRestriction())
            assertThat(result.countries).isEmpty()
            assertThat(result.outcomes).isEmpty()
        }
    }

    @Test
    fun `can get expectations for responsibility set`()
    {
        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
            db.addScenarioDescription(otherScenarioId, "other desc", "YF")
            db.addGroup(groupId)
            val setId = db.addResponsibilitySet(groupId, touchstoneVersionId)
            val r1 = db.addResponsibility(setId, touchstoneVersionId, scenarioId)
            val r2 = db.addResponsibility(setId, touchstoneVersionId, otherScenarioId)
            val expId = db.addExpectations(r1)
            db.addExistingExpectationsToResponsibility(r2, expId)
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibilitySet(groupId, touchstoneVersionId)
            assertThat(result).isEqualTo(listOf(
                    ExpectationMapping(
                            exampleExpectations(),
                            listOf(otherScenarioId, scenarioId),
                            disease
                    )
            ))
        }
    }

    @Test
    fun `can get all expectations`()
    {
        val deathsOutcome = Outcome("test_deaths", "test deaths name")
        val casesOutcome = Outcome("test_cases", "test cases name")

        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            db.addTouchstoneVersion("touchstone2", 2, addTouchstone = true)
            db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
            db.addScenarioDescription(otherScenarioId, "other desc", "HepB", addDisease = true)
            db.addScenarioDescription("scenario3", "desc3", "HepB", addDisease = false)
            db.addGroup(groupId)
            db.addGroup(otherGroupId)
            val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
            val setId2 = db.addResponsibilitySet(otherGroupId, "touchstone2-2")
            val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
            val r2 = db.addResponsibility(setId2, "touchstone2-2", otherScenarioId)
            val r3 = db.addResponsibility(setId2, "touchstone2-2", "scenario3")
            val expId1 = db.addExpectations(r1, outcomes=listOf(deathsOutcome))
            val expId2 = db.addExpectations(r2, outcomes=listOf(deathsOutcome, casesOutcome))
            db.addExistingExpectationsToResponsibility(r1, expId1)
            db.addExistingExpectationsToResponsibility(r2, expId2)
            db.addExistingExpectationsToResponsibility(r3, expId2)
        }
        withRepo { repo ->
            val result = repo.getAllExpectations()
            assertThat(result).isEqualTo(listOf(
                    TouchstoneModelExpectations(touchstoneVersionId, groupId, "YF",
                            exampleOutcomeExpectations(outcomes = listOf(deathsOutcome)), listOf(scenarioId)),
                    TouchstoneModelExpectations("touchstone2-2", otherGroupId, "HepB",
                            exampleOutcomeExpectations(id = 2, outcomes = listOf(casesOutcome, deathsOutcome)),
                            listOf(otherScenarioId, "scenario3"))
            ))
        }
    }

    @Test
    fun `get all expectations does not return those from closed touchstones`()
    {
        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            db.addTouchstoneVersion("touchstone2", 2, status="finished", addTouchstone = true)
            db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
            db.addScenarioDescription(otherScenarioId, "other desc", "HepB", addDisease = true)
            db.addGroup(groupId)
            db.addGroup(otherGroupId)
            val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
            val setId2 = db.addResponsibilitySet(otherGroupId, "touchstone2-2")
            val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
            val r2 = db.addResponsibility(setId2, "touchstone2-2", otherScenarioId)
            val expId1 = db.addExpectations(r1)
            val expId2 = db.addExpectations(r2)
            db.addExistingExpectationsToResponsibility(r1, expId1)
            db.addExistingExpectationsToResponsibility(r2, expId2)
        }
        withRepo { repo ->
            val result = repo.getAllExpectations()
            assertThat(result).isEqualTo(listOf(
                    TouchstoneModelExpectations(touchstoneVersionId, groupId, "YF", exampleOutcomeExpectations(),
                            listOf(scenarioId))
            ))
        }
    }

    @Test
    fun `get all expectations does not return those from in preparation touchstones`()
    {
        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 1, status="in-preparation", addTouchstone = true)
            db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
            db.addGroup(groupId)
            val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
            val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
            val expId1 = db.addExpectations(r1)
            db.addExistingExpectationsToResponsibility(r1, expId1)
        }
        withRepo { repo ->
            val result = repo.getAllExpectations()
            assertThat(result.count()).isEqualTo(0)
        }
    }

    @Test
    fun `get all expectations does not return those from closed responsibilities`()
    {
        withDatabase { db ->
            db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
            db.addTouchstoneVersion("touchstone2", 2, addTouchstone = true)
            db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
            db.addScenarioDescription(otherScenarioId, "other desc", "HepB", addDisease = true)
            db.addGroup(groupId)
            db.addGroup(otherGroupId)
            val setId1 = db.addResponsibilitySet(groupId, touchstoneVersionId)
            val setId2 = db.addResponsibilitySet(otherGroupId, "touchstone2-2")
            val r1 = db.addResponsibility(setId1, touchstoneVersionId, scenarioId)
            val r2 = db.addResponsibility(setId2, "touchstone2-2", otherScenarioId, open=false)
            val expId1 = db.addExpectations(r1)
            val expId2 = db.addExpectations(r2)
            db.addExistingExpectationsToResponsibility(r1, expId1)
            db.addExistingExpectationsToResponsibility(r2, expId2)
        }
        withRepo { repo ->
            val result = repo.getAllExpectations()
            assertThat(result).isEqualTo(listOf(
                    TouchstoneModelExpectations(touchstoneVersionId, groupId, "YF", exampleOutcomeExpectations(),
                            listOf(scenarioId))
            ))
        }
    }

    private fun addResponsibilityAnd(action: (JooqContext, Int, Int) -> Int) = withDatabase { db ->
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addScenarioDescription(scenarioId, "desc", disease, addDisease = true)
        db.addGroup(groupId)
        val setId = db.addResponsibilitySet(groupId, touchstoneVersionId)
        val responsibilityId = db.addResponsibility(setId, touchstoneVersionId, scenarioId)
        action(db, setId, responsibilityId)
    }
}
