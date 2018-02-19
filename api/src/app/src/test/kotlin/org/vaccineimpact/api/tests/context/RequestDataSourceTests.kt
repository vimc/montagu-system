package org.vaccineimpact.api.tests.context

import com.nhaarman.mockito_kotlin.anyOrNull
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.MultipartStreamSource
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.StringReader

class RequestDataSourceTests : MontaguTests()
{
    @Test
    fun `can get content type from body source`()
    {
        val reader = StringReader("Text")
        val context = mock<ActionContext> {
            on { requestReader() } doReturn reader
            on { contentType() } doReturn "content/type"
        }
        val source = RequestBodySource(context)
        assertThat(source.getContent()).isEqualTo(reader)
    }

    @Test
    fun `can get content type from multipart stream source`()
    {
        val file = StringReader("Text")
        val context = mock<ActionContext> {
            on { getPart(eq("part1"), anyOrNull()) } doReturn file
        }
        val source = MultipartStreamSource("part1", context)
        assertThat(source.getContent()).isEqualTo(file)
    }
}