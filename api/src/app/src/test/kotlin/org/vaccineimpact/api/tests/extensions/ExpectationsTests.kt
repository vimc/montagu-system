package org.vaccineimpact.api.tests.extensions

import org.junit.Test
import org.assertj.core.api.Assertions.assertThat
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Expectations
import org.vaccineimpact.api.models.toSequence
import org.vaccineimpact.api.test_helpers.MontaguTests

class ExpectationsTests : MontaguTests()
{

    @Test
    fun generatesSequence()
    {
        val expectedOutcomes = listOf("Dalys", "Deaths")

        val expectations = Expectations(2000..2030, 1..10, CohortRestriction(null,null),
                listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), expectedOutcomes)

        val result = expectations.toSequence().toList()

        assertThat(result.count()).isEqualTo(620)
        assertThat(result.all{ it.outcomes.keys.containsAll(expectedOutcomes)}).isTrue()
    }

}