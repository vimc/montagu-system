
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import khttp.post
import khttp.structures.authorization.BasicAuthorization
import org.jooq.DSLContext
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList

sealed class TokenResponse
{
    class Token(val token: String): TokenResponse()
    class Error(val message: String): TokenResponse()
}

class TokenFetcher
{
    fun getToken(email: String, password: String): TokenResponse
    {
        val url = EndpointBuilder().build("/authenticate/")
        val auth = BasicAuthorization(email, password)
        val response = post(url,
                data = mapOf("grant_type" to "client_credentials"),
                auth = auth
        )
        val json = Parser().parse(StringBuilder(response.text)) as JsonObject
        if (json.containsKey("error"))
        {
            return TokenResponse.Error(json["error"] as String)
        }
        else
        {
            return TokenResponse.Token(json["access_token"] as String)
        }
    }
}