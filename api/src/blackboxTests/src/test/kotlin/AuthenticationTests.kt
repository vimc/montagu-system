import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.json
import khttp.post
import khttp.structures.authorization.BasicAuthorization
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AuthenticationTests : DatabaseTest()
{
    val url = EndpointBuilder().build("/authenticate/")

    @Before
    fun addUser()
    {
        UserHelper.saveUser("user", "Full Name", "email@example.com", "password")
    }

    @Test
    fun `authentication fails without BasicAuth header`()
    {
        val result = post("user", "password", includeAuth = false)
        assertThat(result).isEqualTo(json {
            obj(
                    "error" to "Bad credentials"
            )
        })
    }

    @Test
    fun `unknown username does not authenticate`()
    {
        val result = post("bad_user", "password")
        assertThat(result).isEqualTo(json {
            obj(
                    "error" to "Bad credentials"
            )
        })
    }

    @Test
    fun `incorrect password does not authenticate`()
    {
        val result = post("user", "bad_password")
        assertThat(result).isEqualTo(json {
            obj(
                    "error" to "Bad credentials"
            )
        })
    }

    @Test
    fun `correct password does authenticate`()
    {
        val result = post("user", "password")
        assertThat(result).doesNotContainKey("error")
        assertThat(result).containsKey("access_token")
        assertThat(result["token_type"]).isEqualTo("bearer")
        assertThat(isLong(result["expires_in"].toString()))
    }

    private fun isLong(raw: String): Boolean
    {
        try
        {
            raw.toLong()
            return true
        }
        catch (e: NumberFormatException)
        {
            return false
        }
    }

    private fun post(username: String, password: String, includeAuth: Boolean = true): JsonObject
    {
        val auth = if (includeAuth) BasicAuthorization(username, password) else null
        val text = post(url,
                data = mapOf("grant_type" to "client_credentials"),
                auth = auth).text
        println(text)
        return Parser().parse(StringBuilder(text)) as JsonObject
    }
}