package org.vaccineimpact.api.tests.extensions

import org.assertj.core.api.Assertions.*
import org.junit.Test
import org.vaccineimpact.api.app.checkAllValuesAreEqual
import org.vaccineimpact.api.test_helpers.MontaguTests

class SequenceCheckAllValuesAreEqualTests : MontaguTests()
{
    @Test
    fun `sequence is passed through unchanged if all values are equal`()
    {
        val source = listOf(1, 1, 1, 1)
        val checked = source.asSequence().checkAllValuesAreEqual({ it }, Exception("Shouldn't happen"))
        assertThat(checked.toList()).hasSameElementsAs(source)
    }

    @Test
    fun `sequence remains lazy when checking all values`()
    {
        var i = 1
        val naturalNumbers = generateSequence { i++ }
        val checked = naturalNumbers.checkAllValuesAreEqual({ true }, Exception("Shouldn't happen"))
        assertThat(i).isEqualTo(1)
        assertThat(checked.take(3).toList()).hasSameElementsAs(listOf(1, 2, 3))
        assertThat(i).isEqualTo(4)
    }

    @Test
    fun `throws exception on first value that is different`()
    {
        var i = 1
        val naturalNumbers = generateSequence { i++ }
        val checked = naturalNumbers.checkAllValuesAreEqual({ it == 3 }, Exception("Should happen"))
        val iterator = checked.iterator()
        // 1 != 3
        assertThatCode { iterator.next() }.doesNotThrowAnyException()
        // 2 != 2
        assertThatCode { iterator.next() }.doesNotThrowAnyException()
        // 3 == 3
        assertThatThrownBy { iterator.next() }.hasMessage("Should happen")
    }
}