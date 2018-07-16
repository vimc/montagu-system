package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqExpectationsRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.models.YearRange

class ExpectationsRepositoryTests : RepositoryTests<ExpectationsRepository>()
{
    override fun makeRepository(db: JooqContext) = JooqExpectationsRepository(db.dsl)

    @Test
    fun `can pull basic expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, responsibilityId ->
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
            val result = repo.getExpectationsForResponsibility(responsibilityId)
            assertThat(result).isEqualTo(Expectations(
                    years = 2000..2100,
                    ages = 0..99,
                    cohorts = CohortRestriction(),
                    countries = emptyList(),
                    outcomes = emptyList()
            ))
        }
    }

    @Test
    fun `can pull cohort expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    cohortMinInclusive = 2005,
                    cohortMaxInclusive = 2015
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId)
            assertThat(result.cohorts).isEqualTo(CohortRestriction(
                    minimumBirthYear = 2005,
                    maximumBirthYear = 2015
            ))
        }
    }

    @Test
    fun `can pull country expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, responsibilityId ->
            db.addCountries(listOf("ABC", "DEF", "GHI"))
            db.addExpectations(
                    responsibilityId,
                    countries = listOf("ABC", "DEF")
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId)
            assertThat(result.countries).hasSameElementsAs(listOf(
                    Country("ABC", "ABC-Name"),
                    Country("DEF", "DEF-Name")
            ))
        }
    }

    @Test
    fun `can pull outcome expectations`()
    {
        val responsibilityId = addResponsibilityAnd { db, responsibilityId ->
            db.addExpectations(
                    responsibilityId,
                    outcomes = listOf("cases", "deaths")
            )
        }
        withRepo { repo ->
            val result = repo.getExpectationsForResponsibility(responsibilityId)
            assertThat(result.outcomes).hasSameElementsAs(listOf(
                    "cases",
                    "deaths"
            ))
        }
    }

    private fun addResponsibilityAnd(action: (JooqContext, Int) -> Unit) = withDatabase { db ->
        db.addTouchstoneVersion("touchstone", 1, addTouchstone = true)
        db.addScenarioDescription("scenario", "desc", "YF", addDisease = true)
        db.addGroup("group")
        val responsibilityId = db.addResponsibilityInNewSet("group", "touchstone-1", "scenario")
        action(db, responsibilityId)
        responsibilityId
    }
}
