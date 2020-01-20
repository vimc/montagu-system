package org.vaccineimpact.api.tests.clients

import com.nhaarman.mockito_kotlin.*
import okhttp3.*
import okhttp3.ResponseBody.Companion.toResponseBody
import okio.Buffer
import org.assertj.core.api.Assertions
import org.junit.Test
import org.mockito.ArgumentCaptor
import org.vaccineimpact.api.app.clients.OkHttpOrderlyWebAPIClient
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.test_helpers.MontaguTests
import com.github.fge.jackson.JsonLoader


class TestOkHttpOrderlyWebAPIClient(private val client: OkHttpClient, val config: ConfigWrapper):
        OkHttpOrderlyWebAPIClient("test_montagu_token", config)
{
   protected override fun getHttpClient(): OkHttpClient
   {
       return client
   }
}

class OkHttpOrderlyWebAPIClientTests: MontaguTests()
{
    @Test
    fun `can add user`()
    {
        val responseBody = "{access_token: \"test_orderly_web_token\", token_type: \"test\", expires_in: 1000}"
                .toResponseBody()

        val request = Request.Builder().url("http://test-orderly-web").build()

        val response = Response.Builder()
                .body(responseBody)
                .code(200)
                .request(request)
                .protocol(Protocol.HTTP_2)
                .message("test message")
                .build()

        val mockCall = mock<Call>{
            on { execute() } doReturn response
        }

        val mockClient = mock<OkHttpClient>{
            on {newCall(any())} doReturn(mockCall)
        }

        val mockConfig = mock<ConfigWrapper>{
            on{ get("orderlyweb.api.url") } doReturn "http://test-orderly-web"
        }
        val sut = TestOkHttpOrderlyWebAPIClient(mockClient, mockConfig)

        sut.addUser("test@example.com", "test.user", "Test User")

        val requestArg : ArgumentCaptor<Request> = ArgumentCaptor.forClass(Request::class.java)
        verify(mockClient, times(2)).newCall(capture(requestArg))
        val allRequests = requestArg.allValues

        //Test GetOrderlyWebToken
        val tokenRequest = allRequests[0]
        Assertions.assertThat(tokenRequest.url.toString()).isEqualTo("http://test-orderly-web/login")
        var headers = tokenRequest.headers
        Assertions.assertThat(headers["Authorization"]).isEqualTo("token test_montagu_token")
        Assertions.assertThat(headers["Accept"]).isEqualTo("application/json")

        var buffer = Buffer()
        tokenRequest.body!!.writeTo(buffer)
        val tokenBodyString =  buffer.readUtf8()
        Assertions.assertThat(tokenBodyString).isEqualTo("")

        //Test post userDetails
        val postUserRequest = allRequests[1]
        Assertions.assertThat(postUserRequest.url.toString()).isEqualTo("http://test-orderly-web/user/add")
        headers = postUserRequest.headers
        Assertions.assertThat(headers["Authorization"]).isEqualTo("Bearer test_orderly_web_token")

        buffer = Buffer()
        postUserRequest.body!!.writeTo(buffer)
        val postUserBodyString = buffer.readUtf8()

        val userDetailsJson = JsonLoader.fromString(postUserBodyString)
        Assertions.assertThat(userDetailsJson["email"].asText()).isEqualTo("test@example.com")
        Assertions.assertThat(userDetailsJson["username"].asText()).isEqualTo("test.user")
        Assertions.assertThat(userDetailsJson["display_name"].asText()).isEqualTo("Test User")
        Assertions.assertThat(userDetailsJson["source"].asText()).isEqualTo("Montagu")
    }
}