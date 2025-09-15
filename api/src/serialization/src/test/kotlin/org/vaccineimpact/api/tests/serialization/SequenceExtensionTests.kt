package org.vaccineimpact.api.tests.serialization

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.serialization.headAndTail
import org.vaccineimpact.api.test_helpers.MontaguTests

class SequenceExtensionTests : MontaguTests()
{
    @Test
    fun `headAndTail returns head and tail`()
    {
        val sequence = sequenceOf(1, 2, 3, 4, 5)
        val (head, tail) = sequence.headAndTail()
        assertThat(head).isEqualTo(1)
        assertThat(tail.toList()).hasSameElementsAs(listOf(2, 3, 4, 5))
    }
}