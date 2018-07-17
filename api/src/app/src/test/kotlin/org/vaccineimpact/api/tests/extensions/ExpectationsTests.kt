package org.vaccineimpact.api.tests.extensions

import org.junit.Test
import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.test_helpers.MontaguTests

class ExpectationsTests : MontaguTests()
{

    @Test
    fun `can generate sequence with no cohort restrictions`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val expectations = Expectations(2000..2007, 1..10, CohortRestriction(null,null),
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), expectedOutcomes)

        val result = expectations.toSequence().toList()

        val expectedCohorts = 80
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
        assertThat(result.all{ it.outcomes.keys.containsAll(expectedOutcomes)}).isTrue()
    }

    @Test
    fun `can generate sequence with min cohort restriction only`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(1994, null)

        val expectations = Expectations(2000..2007, 1..10, cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), expectedOutcomes)

        val result = expectations.toSequence().toList()

        val expectedCohorts = 70
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate sequence with max cohort restriction only`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(null, 2001)

        val expectations = Expectations(2000..2007, 1..10, cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), expectedOutcomes)

        val result = expectations.toSequence().toList()

        val expectedCohorts = 65
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate sequence with cohort restrictions`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(1996, 2002)

        val expectations = Expectations(2000..2007, 1..10, cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), expectedOutcomes)

        val result = expectations.toSequence().toList()

        val expectedCohorts = 49
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

}