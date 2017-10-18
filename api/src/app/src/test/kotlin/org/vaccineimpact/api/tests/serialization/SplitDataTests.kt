package org.vaccineimpact.api.tests.serialization

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doAnswer
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.Serialisable
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.Writer

class SplitDataTests : MontaguTests()
{
    @Test
    fun `can serialize`()
    {
        val serializer = mock<Serializer> {
            on { it.toResult(any()) } doReturn "METADATA"
        }
        val table = mock<Serialisable<Any>> {
            on { it.serialize(any()) } doReturn "ROWS"
        }
        val data = SplitData(1, table)
        val actual = data.serialize(serializer).trim()
        assertThat(actual).isEqualTo("METADATA\n---\nROWS")
    }
}