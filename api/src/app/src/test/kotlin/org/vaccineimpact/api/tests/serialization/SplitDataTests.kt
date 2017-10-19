package org.vaccineimpact.api.tests.serialization

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doAnswer
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.app.serialization.StreamSerializable
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.serializeToStreamAndGetAsString
import java.io.OutputStream

class SplitDataTests : MontaguTests()
{
    @Test
    fun `can serialize`()
    {
        val serializer = mock<Serializer> {
            on { it.toResult(any()) } doReturn "METADATA"
        }
        val table = mock<StreamSerializable<Any>> {
            on { it.serialize(any(), any()) } doAnswer { invocationOnMock ->
                val stream = invocationOnMock.getArgument<OutputStream>(0)
                stream.bufferedWriter().use {
                    writer -> writer.write("ROWS")
                }
            }
        }
        val data = SplitData(1, table)
        val actual = serializeToStreamAndGetAsString { stream ->
            data.serialize(stream, serializer)
        }
        assertThat(actual).isEqualTo("METADATA\n---\nROWS")
    }
}