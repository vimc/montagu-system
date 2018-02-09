package org.vaccineimpact.api.tests.context

import com.nhaarman.mockito_kotlin.anyOrNull
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.context.RequestBodySource
import org.vaccineimpact.api.app.context.RequestData
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.io.StringReader

class RequestBodySourceTests : MontaguTests()
{
    @Test
    fun `can get content type from simple body`()
    {
        val source = RequestBodySource.Simple()
        val reader = StringReader("Text")
        val context = mock<ActionContext> {
            on { requestReader() } doReturn reader
            on { contentType() } doReturn "content/type"
        }
        assertThat(source.getContent(context)).isEqualTo(RequestData(reader, "content/type"))
    }

    @Test
    fun `can get content type from multipart body`()
    {
        val source = RequestBodySource.Multipart.FromStream("part1")
        val file = RequestData(StringReader("Text"), "content/type")
        val context = mock<ActionContext> {
            on { getPart(eq("part1"), anyOrNull()) } doReturn file
        }
        assertThat(source.getContent(context)).isEqualTo(file)
    }
}