package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.vaccineimpact.api.app.logic.HttpClient
import org.vaccineimpact.api.app.logic.SlackNotifier
import org.vaccineimpact.api.db.ConfigWrapper

class SlackNotifierTests
{
    @Test
    fun `posts correctly formatted Slack message`()
    {
        val mockHttpClient = mock<HttpClient>()
        val mockConfig = mock<ConfigWrapper> {
            on { get("slack.url") } doReturn "http://fake-url.com"
        }
        val sut = SlackNotifier(mockHttpClient, mockConfig)
        sut.notify("some message")
        verify(mockHttpClient).post("http://fake-url.com",
                mapOf("Content-type" to "application/json"),
                mapOf("text" to "some message"))
    }

    @Test
    fun `errors are caught`()
    {
        val mockHttpClient = mock<HttpClient> {
            on { post(any(), any(), any()) } doThrow Exception("whatever")
        }
        val mockConfig = mock<ConfigWrapper> {
            on { get("slack.url") } doReturn "http://fake-url.com"
        }
        val sut = SlackNotifier(mockHttpClient, mockConfig)
        sut.notify("some message")
    }

}