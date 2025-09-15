package org.vaccineimpact.api.tests.clients

import com.nhaarman.mockito_kotlin.*
import okhttp3.*
import okhttp3.ResponseBody.Companion.toResponseBody
import okio.Buffer
import org.assertj.core.api.Assertions
import org.junit.Test
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatcher
import org.vaccineimpact.api.app.clients.OkHttpPackitAPIClient
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.test_helpers.MontaguTests
import com.github.fge.jackson.JsonLoader
import org.vaccineimpact.api.app.errors.PackitError


class TestOkHttpPackitAPIClient(private val client: OkHttpClient,
                                    val montaguToken: String,
                                    val config: ConfigWrapper):
        OkHttpPackitAPIClient(montaguToken, config)
{
   protected override fun getHttpClient(): OkHttpClient
   {
       return client
   }
}

class OkHttpPackitAPIClientTests: MontaguTests()
{

    private val montyToken = "test-montagu-token";
    private val packitTokenResponseBody = "{\"token\": \"test_packit_token\"}"
        .toResponseBody()

    private val mockConfig = mock<ConfigWrapper>{
        on{ get("packit.api.url") } doReturn "http://test-packit"
    }

    @Test
    fun `can add user`()
    {
        val tokenRequest = Request.Builder().url("http://test-packit/auth/login/montagu").build()

        val tokenResponse = Response.Builder()
                .body(packitTokenResponseBody)
                .code(200)
                .message("test message")
                .request(tokenRequest)
                .protocol(Protocol.HTTP_2)
                .build()

        val addUserRequest = Request.Builder().url("http://test-packit/user/external").build()
        val addUserResponse = Response.Builder()
            .body("ok".toResponseBody())
            .code(201)
            .message("test message")
            .request(addUserRequest)
            .protocol(Protocol.HTTP_2)
            .build()

        val mockTokenCall = mock<Call>{
            on { execute() } doReturn tokenResponse
        }

        val mockAddUserCall = mock<Call>{
            on { execute() } doReturn addUserResponse
        }

        val mockClient = mock<OkHttpClient>{
            on { newCall(argThat { this.url.toString().endsWith("/auth/login/montagu") }) } doReturn(mockTokenCall)
            on { newCall(argThat { this.url.toString().endsWith("/user/external") }) } doReturn(mockAddUserCall)
        }

        val sut = TestOkHttpPackitAPIClient(mockClient, montyToken, mockConfig)
        sut.addUser("test@example.com", "test.user", "Test User")

        val requestArg : ArgumentCaptor<Request> = ArgumentCaptor.forClass(Request::class.java)
        verify(mockClient, times(2)).newCall(capture(requestArg))
        val allRequests = requestArg.allValues

        //Test GetPackitToken
        val actualTokenRequest = allRequests[0]
        Assertions.assertThat(actualTokenRequest.method).isEqualTo("GET")
        Assertions.assertThat(actualTokenRequest.url.toString()).isEqualTo("http://test-packit/auth/login/montagu")
        var headers = actualTokenRequest.headers
        Assertions.assertThat(headers["Accept"]).isEqualTo("application/json")
        Assertions.assertThat(headers["Authorization"]).isEqualTo("Bearer $montyToken")

        //Test post userDetails
        val postUserRequest = allRequests[1]
        Assertions.assertThat(postUserRequest.method).isEqualTo("POST")
        Assertions.assertThat(postUserRequest.url.toString()).isEqualTo("http://test-packit/user/external")
        headers = postUserRequest.headers
        Assertions.assertThat(headers["Authorization"]).isEqualTo("Bearer test_packit_token")

        val buffer = Buffer()
        postUserRequest.body!!.writeTo(buffer)
        val postUserBodyString = buffer.readUtf8()

        val userDetailsJson = JsonLoader.fromString(postUserBodyString)
        Assertions.assertThat(userDetailsJson["email"].asText()).isEqualTo("test@example.com")
        Assertions.assertThat(userDetailsJson["username"].asText()).isEqualTo("test.user")
        Assertions.assertThat(userDetailsJson["displayName"].asText()).isEqualTo("Test User")
    }

    @Test
    fun `throws PackitError if unsuccessful call to add user`()
    {
        val request = Request.Builder().url("http://test-packit").build()

        val response = Response.Builder()
                .body(packitTokenResponseBody)
                .code(500)
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

        val sut = TestOkHttpPackitAPIClient(mockClient, montyToken, mockConfig)

        Assertions.assertThatThrownBy {  sut.addUser("test@example.com", "test.user", "Test User") }
                .isInstanceOf(PackitError::class.java)
    }
}