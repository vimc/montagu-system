package org.vaccineimpact.api.tests.clients

import com.nhaarman.mockito_kotlin.*
import okhttp3.*
import okhttp3.ResponseBody.Companion.toResponseBody
import okio.Buffer
import org.assertj.core.api.Assertions
import org.junit.Test
import org.mockito.ArgumentCaptor
import org.vaccineimpact.api.app.clients.OkHttpPackitAPIClient
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.test_helpers.MontaguTests
import com.github.fge.jackson.JsonLoader
import org.vaccineimpact.api.app.errors.PackitError


class TestOkHttpPackitAPIClient(private val client: OkHttpClient,
                                    val context: ActionContext,
                                    val userRepository: UserRepository
                                    val config: ConfigWrapper):
        OkHttpPackitAPIClient(context, userRepository, config)
{
   protected override fun getHttpClient(): OkHttpClient
   {
       return client
   }
}

class OkHttpPackitAPIClientTests: MontaguTests()
{
    private val packitTokenresponseBody = "{\"token\": \"test_packit_token\"}"
        .toResponseBody()

    private val mockContext = mock<ActionContext> {
        on { username } doReturn "admin.user"
    }

    private val adminUser = InternalUser(UserProperties("admin.user", "Admin User", "admin.user@example.com"), listOf(), listOf())
    val mockUserRepository = mock<UserRepository> {
        on { getUserByUsername("admin.user") } doReturn adminUser
    }

    private val mockConfig = mock<ConfigWrapper>{
        on{ get("packit.api.url") } doReturn "http://test-packit"
    }

    @Test
    fun `can add user`()
    {
        val request = Request.Builder().url("http://test-packit").build()

        val response = Response.Builder()
                .body(packitTokenresponseBody)
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

        val sut = TestOkHttpOrderlyWebAPIClient(mockClient, mockConfig)
        sut.addUser("test@example.com", "test.user", "Test User")

        val requestArg : ArgumentCaptor<Request> = ArgumentCaptor.forClass(Request::class.java)
        verify(mockClient, times(2)).newCall(capture(requestArg))
        val allRequests = requestArg.allValues

        //Test GetPackitToken
        val tokenRequest = allRequests[0]
        Assertions.assertThat(tokenRequest.url.toString()).isEqualTo("http://test-packit/login/preauth")
        var headers = tokenRequest.headers
        Assertions.assertThat(headers["Accept"]).isEqualTo("application/json")
        Assertions.assertThat(headers["X-Remote-User"]).isEqualTo("admin.user")
        Assertions.assertThat(headers["X-Remote-Name"]).isEqualTo("Admin User")
        Assertions.assertThat(headers["X-Remote-Email"]).isEqualTo("admin.user@example.com")

        var buffer = Buffer()
        tokenRequest.body!!.writeTo(buffer)
        val tokenBodyString =  buffer.readUtf8()
        Assertions.assertThat(tokenBodyString).isEqualTo("")

        //Test post userDetails
        val postUserRequest = allRequests[1]
        Assertions.assertThat(postUserRequest.url.toString()).isEqualTo("http://test-packit/user/external")
        headers = postUserRequest.headers
        Assertions.assertThat(headers["Authorization"]).isEqualTo("Bearer test_packit_token")

        buffer = Buffer()
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

        val sut = TestOkHttpOrderlyWebAPIClient(mockClient, mockConfig)

        Assertions.assertThatThrownBy {  sut.addUser("test@example.com", "test.user", "Test User") }
                .isInstanceOf(PackitError::class.java)
    }
}