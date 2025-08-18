package org.vaccineimpact.api.app.clients

import com.google.gson.JsonSyntaxException
import com.google.gson.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.vaccineimpact.api.app.errors.PackitError
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.app.context.ActionContext
import java.security.cert.X509Certificate
import javax.net.ssl.*

interface PackitAPIClient
{
    @Throws(PackitError::class)
    fun addUser(email: String, username: String, displayName: String)
}

data class PackitLoginResult(val token: String)
data class PackitUserDetails(val email: String, val username: String, val displayName: String, val userRoles: List<String>)

abstract class OkHttpPackitAPIClient(private val montaguToken: String,
                                     private val config: ConfigWrapper = Config): PackitAPIClient {

    companion object
    {
        fun create(token: String): OkHttpPackitAPIClient
        {
            return if (Config.getBool("allow.localhost"))
                LocalOkHttpPackitAPIClient(token)
            else
                RemoteHttpPackitAPIClient(token)
        }
    }

    private val baseUrl = config["packit.api.url"]
    private var packitToken: String? = null
    private val gson = GsonBuilder().create()

    override fun addUser(email: String, username: String, displayName: String) {
        ensurePackitToken()
        val userDetails = PackitUserDetails(email, username, displayName, listOf())
        val postBody = gson.toJson(userDetails)
        val postResponse = post("$baseUrl/user/external", mapOf("Authorization" to "Bearer $packitToken"), postBody)
        val code = postResponse.code
        if (code != 201) {
            val body = postResponse.body!!.string()
            throw PackitError("Error adding user to Packit. Code: $code")
        }
    }

    private fun ensurePackitToken() {
        if (packitToken == null) {
            val requestHeaders = mapOf(
                "Accept" to "application/json",
                "Authorization" to "Bearer $montaguToken"
            )
            get("$baseUrl/auth/login/montagu", requestHeaders)
                .use { response ->
                    val body = response.body!!.string()
                    if (response.code != 200) {
                        throw PackitError("Error getting Packit token. Code: ${response.code}")
                    }

                    val loginResult = parseLoginResult(body)
                    packitToken = loginResult.token
                }
        }
    }

    private fun post(url: String, headersMap: Map<String, String>, body: String): Response
    {
        val client = getHttpClient();
        val headers = buildHeaders(headersMap);
        val requestBody = body.toRequestBody("application/json".toMediaTypeOrNull())

        val request = Request.Builder()
                .url(url)
                .headers(headers)
                .post(requestBody)
                .build()
        return client.newCall(request).execute()
    }

    private fun get(url: String, headersMap: Map<String, String>): Response
    {
        val client = getHttpClient();
        val headers = buildHeaders(headersMap);

        val request = Request.Builder()
            .url(url)
            .headers(headers)
            .get()
            .build()
        return client.newCall(request).execute()
    }

    private fun buildHeaders(headersMap: Map<String, String>): Headers
    {
        val headersBuilder = Headers.Builder()
        headersMap.forEach { k, v ->  headersBuilder.add(k, v)}
        return headersBuilder.build()
    }

    private fun parseLoginResult(jsonString: String): PackitLoginResult
    {
        return try
        {
            gson.fromJson<PackitLoginResult>(jsonString, PackitLoginResult::class.java);
        }
        catch(e: JsonSyntaxException)
        {
            throw PackitError("Failed to parse Packit login response as JSON.")
        }
    }

    protected abstract fun getHttpClient(): OkHttpClient
}

class LocalOkHttpPackitAPIClient(montaguToken: String): OkHttpPackitAPIClient(montaguToken)
{
    override fun getHttpClient(): OkHttpClient
    {
        //Stolen from https://stackoverflow.com/questions/25509296/trusting-all-certificates-with-okhttp
        // Create a trust manager that does not validate certificate chains
        val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {
            }

            override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {
            }

            override fun getAcceptedIssuers() = arrayOf<X509Certificate>()
        })

        val allHostnameVerifier = object : HostnameVerifier{
            override fun verify(var1: String, var2: SSLSession): Boolean
            { return true }
        }

        // Install the all-trusting trust manager
        val sslContext = SSLContext.getInstance("SSL")
        sslContext.init(null, trustAllCerts, java.security.SecureRandom())
        // Create an ssl socket factory with our all-trusting manager
        val sslSocketFactory = sslContext.socketFactory

        return OkHttpClient.Builder()
                .sslSocketFactory(sslSocketFactory, trustAllCerts[0] as X509TrustManager)
                .hostnameVerifier(allHostnameVerifier)
                .build()
    }
}

class RemoteHttpPackitAPIClient(montaguToken: String): OkHttpPackitAPIClient(montaguToken)
{
    override fun getHttpClient(): OkHttpClient
    {
        return OkHttpClient()
    }
}
