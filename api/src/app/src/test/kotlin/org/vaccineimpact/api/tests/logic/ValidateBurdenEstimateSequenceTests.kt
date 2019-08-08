package org.vaccineimpact.api.tests.logic

import org.assertj.core.api.Assertions.*
import org.junit.Test
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.validate
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.CountryOutcomeExpectations
import org.vaccineimpact.api.test_helpers.MontaguTests

class ValidateBurdenEstimateSequenceTests : MontaguTests()
{
    private val countries = listOf(Country("AFG", ""), Country("AGO", ""))
    private val expectations = CountryOutcomeExpectations(1, "desc", 2000..2001, 1..2, CohortRestriction(),
            countries,
            listOf())

    @Test
    fun `sequence is passed through unchanged if all values are expected and disease consistent`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "Afghanistan", 10000F, mapOf()),
                BurdenEstimateWithRunId("d1", null, 2001, 1, "AFG", "Afghanistan", 10000F, mapOf()),
                BurdenEstimateWithRunId("d1", null, 2000, 1, "AGO", "Angola", 10000F, mapOf()),
                BurdenEstimateWithRunId("d1", null, 2000, 2, "AFG", "Afghanistan", 10000F, mapOf()))
        val checked = source.asSequence().validate(expectations.expectedRowLookup())
        assertThat(checked.toList()).hasSameElementsAs(source)
    }

    @Test
    fun `throws exception on multiple diseases`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "", 10000F, mapOf()),
                BurdenEstimateWithRunId("d2", null, 2001, 1, "AFG", "", 10000F, mapOf()))

        assertThatThrownBy {
            source.asSequence().validate(expectations.expectedRowLookup()).toList()
        }.isInstanceOf(InconsistentDataError::class.java).hasMessageContaining("disease")
    }

    @Test
    fun `throws exception if country not present`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "Bad", "", 10000F, mapOf()))

        assertThatThrownBy {
            source.asSequence().validate(expectations.expectedRowLookup()).toList()
        }.isInstanceOf(BadRequest::class.java).hasMessageContaining("country")
    }

    @Test
    fun `throws exception if age not present`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 10, "AFG", "", 10000F, mapOf()))

        assertThatThrownBy {
            source.asSequence().validate(expectations.expectedRowLookup()).toList()
        }.isInstanceOf(BadRequest::class.java).hasMessageContaining("age")
    }

    @Test
    fun `throws exception if year not present`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2003, 1, "AFG", "", 10000F, mapOf()))

        assertThatThrownBy {
            source.asSequence().validate(expectations.expectedRowLookup()).toList()
        }.isInstanceOf(BadRequest::class.java).hasMessageContaining("year")
    }

    @Test
    fun `throws exception on duplicate row`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "", 10000F, mapOf()),
                BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "", 10000F, mapOf()))

        assertThatThrownBy {
            source.asSequence().validate(expectations.expectedRowLookup()).toList()
        }.isInstanceOf(InconsistentDataError::class.java).hasMessageContaining("Duplicate")
    }
    @Test
    fun `sequence remains lazy when checking all values`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "Afghanistan", 10000F, mapOf()),
                BurdenEstimateWithRunId("d2", null, 2001, 1, "AFG", "", 10000F, mapOf()))

        val checked = source.asSequence().validate(expectations.expectedRowLookup())
        checked.take(1).toList()

        assertThatThrownBy { checked.take(2).toList() }
                .isInstanceOf(InconsistentDataError::class.java)
    }

    @Test
    fun `throws exception on first value that is different`()
    {
        val source = listOf(BurdenEstimateWithRunId("d1", null, 2000, 1, "AFG", "Afghanistan", 10000F, mapOf()),
                BurdenEstimateWithRunId("d1", null, 2001, 1, "AFG", "Afghanistan", 10000F, mapOf()),
                BurdenEstimateWithRunId("d2", null, 2000, 1, "AFG", "", 10000F, mapOf()))

        val checked = source.asSequence().validate(expectations.expectedRowLookup())

        val iterator = checked.iterator()
        // 1 != 3
        assertThatCode { iterator.next() }.doesNotThrowAnyException()
        // 2 != 2
        assertThatCode { iterator.next() }.doesNotThrowAnyException()
        // 3 == 3
        assertThatThrownBy { iterator.next() }.isInstanceOf(InconsistentDataError::class.java)
    }
}