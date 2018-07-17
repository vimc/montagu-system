package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqExpectationsRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Expectations

class ExpectationsRepositoryTests : RepositoryTests<ExpectationsRepository>()
{
    override fun makeRepository(db: JooqContext): ExpectationsRepository {
        val scenarioRepo = JooqScenarioRepository(db.dsl)
        return JooqExpectationsRepository(db.dsl,
                JooqResponsibilitiesRepository(db.dsl, scenarioRepo, JooqTouchstoneRepository(db.dsl, scenarioRepo)))
    }

    private val groupId = "group"
    private val scenarioId = "scenario"
    private val touchstoneVersionId = "touchstone-1"

    @Test
    fun `can pull basic expectations`()
    {
        addResponsibilityAnd { db, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
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
            val result = repo.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
            assertThat(result.years).isEqualTo(2000..2100)
            assertThat(result.ages).isEqualTo(0..99)
            assertThat(result.cohorts).isEqualTo(CohortRestriction())
            assertThat(result.countries).isEmpty()
            assertThat(result.outcomes).isEmpty()
        }
    }

    @Test
    fun `can pull cohort expectations`()
    {
        addResponsibilityAnd { db, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    cohortMinInclusive = 2005,
                    cohortMaxInclusive = 2015
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
            assertThat(result.cohorts).isEqualTo(CohortRestriction(
                    minimumBirthYear = 2005,
                    maximumBirthYear = 2015
            ))
        }
    }

    @Test
    fun `can pull country expectations`()
    {
        addResponsibilityAnd { db, responsibilityId ->
            db.addCountries(listOf("ABC", "DEF", "GHI"))
            db.addExpectations(
                    responsibilityId,
                    countries = listOf("ABC", "DEF")
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
            assertThat(result.countries).hasSameElementsAs(listOf(
                    Country("ABC", "ABC-Name"),
                    Country("DEF", "DEF-Name")
            ))
        }
    }

    @Test
    fun `can pull outcome expectations`()
    {
        addResponsibilityAnd { db, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    outcomes = listOf("cases", "deaths")
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
            assertThat(result.outcomes).hasSameElementsAs(listOf(
                    "cases",
                    "deaths"
            ))
        }
    }

    private fun addResponsibilityAnd(action: (JooqContext, Int) -> Unit) = withDatabase { db ->
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addScenarioDescription(scenarioId, "desc", "YF", addDisease = true)
        db.addGroup(groupId)
        val responsibilityId = db.addResponsibilityInNewSet(groupId, touchstoneVersionId, scenarioId)
        action(db, responsibilityId)
        responsibilityId
    }
}
