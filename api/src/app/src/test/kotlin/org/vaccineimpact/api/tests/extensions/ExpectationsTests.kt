package org.vaccineimpact.api.tests.extensions

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.test_helpers.MontaguTests

class ExpectationsTests : MontaguTests()
{
    @Test
    fun `can generate long sequence`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val longCountryList = (1..100).map {
            Country(it.toString(), it.toString())
        }
        val expectations = Expectations(1,
                2001..2080,
                1..80,
                CohortRestriction(null, null),
                longCountryList,
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val expectedCohorts = 80 * 80
        val numCountries = 100

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `generates central row with null cohort size and outcomes`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val countryList = (1..1).map {
            Country(it.toString(), it.toString())
        }
        val expectations = Expectations(1,
                2000..2001,
                1..1,
                CohortRestriction(null, null),
                countryList,
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val first = result[0]
        assertThat(first.age).isEqualTo(1)
        assertThat(first.country).isEqualTo("1")
        assertThat(first.year).isEqualTo(2000)
        assertThat(first.disease).isEqualTo("YF")

        val second = result[1]
        assertThat(second.age).isEqualTo(1)
        assertThat(second.country).isEqualTo("1")
        assertThat(second.year).isEqualTo(2001)
        assertThat(second.disease).isEqualTo("YF")

        assertThat(result.all { it.cohortSize == null }).isTrue()
        assertThat(result.all { it.outcomes.all { it.value == null } }).isTrue()
    }

    @Test
    fun `generates stochastic row with null cohort size, outcomes, and run id`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val countryList = (1..1).map {
            Country(it.toString(), it.toString())
        }

        val expectations = Expectations(1,
                2000..2001,
                1..1,
                CohortRestriction(null, null),
                countryList,
                expectedOutcomes
        )

        val result = expectations.expectedStochasticRows("YF").toList()

        val first = result[0]
        assertThat(first.age).isEqualTo(1)
        assertThat(first.country).isEqualTo("1")
        assertThat(first.year).isEqualTo(2000)
        assertThat(first.disease).isEqualTo("YF")

        val second = result[1]
        assertThat(second.age).isEqualTo(1)
        assertThat(second.country).isEqualTo("1")
        assertThat(second.year).isEqualTo(2001)
        assertThat(second.disease).isEqualTo("YF")

        assertThat(result.all { it.runId == null }).isTrue()
        assertThat(result.all { it.cohortSize == null }).isTrue()
        assertThat(result.all { it.outcomes.all { it.value == null } }).isTrue()
    }

    @Test
    fun `can generate stochastic rows`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val longCountryList = (1..100).map {
            Country(it.toString(), it.toString())
        }
        val expectations = Expectations(1,
                2001..2080,
                1..80,
                CohortRestriction(null, null),
                longCountryList,
                expectedOutcomes
        )

        val result = expectations.expectedStochasticRows("YF").toList()

        val expectedCohorts = 80 * 80
        val numCountries = 100

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate rows with no cohort restrictions`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val expectations = Expectations(
                1,
                2000..2007,
                1..10,
                CohortRestriction(null, null),
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")),
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val expectedCohorts = 80
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate rows with min cohort restriction only`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(1994, null)

        val expectations = Expectations(
                1,
                2000..2007,
                1..10,
                cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")),
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val expectedCohorts = 70
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate rows with max cohort restriction only`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(null, 2001)

        val expectations = Expectations(
                1,
                2000..2007,
                1..10,
                cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")),
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val expectedCohorts = 65
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

    @Test
    fun `can generate rows with cohort restrictions`()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")
        val cohortRestriction = CohortRestriction(1996, 2002)

        val expectations = Expectations(
                1,
                2000..2007,
                1..10,
                cohortRestriction,
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")),
                expectedOutcomes
        )

        val result = expectations.expectedCentralRows("YF").toList()

        val expectedCohorts = 49
        val numCountries = 2

        assertThat(result.count()).isEqualTo(expectedCohorts * numCountries)
    }

}