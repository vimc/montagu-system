package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.RSASignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import java.security.KeyPair
import java.security.SecureRandom
import java.time.Duration
import java.time.Instant
import java.util.*

open class WebTokenHelper(keyPair: KeyPair,
                          private val serializer: Serializer = MontaguSerializer.instance)
{
    open val lifeSpan: Duration = Duration.ofSeconds(Config["token.lifespan"].toLong())
    val issuer = Config["token.issuer"]
    val signatureConfiguration = RSASignatureConfiguration(keyPair)
    val generator = JwtGenerator<CommonProfile>(signatureConfiguration)
    private val random = SecureRandom()

    open fun generateToken(user: MontaguUser): String
    {
        return generator.generate(claims(user))
    }

    open fun generateOneTimeActionToken(action: String,
                                        params: Map<String, String>,
                                        queryString: String?,
                                        lifeSpan: Duration = oneTimeLinkLifeSpan,
                                        username: String): String
    {
        return generator.generate(mapOf(
                "iss" to issuer,
                "sub" to oneTimeActionSubject,
                "exp" to Date.from(Instant.now().plus(lifeSpan)),
                "action" to action,
                "payload" to params.map { "${it.key}=${it.value}" }.joinToString("&"),
                "query" to queryString,
                "nonce" to getNonce(),
                "username" to username
        ))
    }

    open fun encodeResult(result: Result): String
    {
        val json = serializer.toJson(result)
        return generator.generate(
                mapOf("sub" to apiResponseSubject,
                        "iss" to issuer,
                        "result" to json))
    }

    fun claims(user: MontaguUser): Map<String, Any>
    {
        return mapOf(
                "iss" to issuer,
                "sub" to user.username,
                "exp" to Date.from(Instant.now().plus(lifeSpan)),
                "permissions" to user.permissions.joinToString(","),
                "roles" to user.roles.joinToString(",")
        )
    }

    open fun verify(token: String): Map<String, Any> = MontaguTokenAuthenticator(this).validateTokenAndGetClaims(token)

    private fun getNonce(): String
    {
        val bytes = ByteArray(32)
        random.nextBytes(bytes)
        return Base64.getEncoder().encodeToString(bytes)
    }

    companion object
    {
        val oneTimeActionSubject = "onetime_link"
        val apiResponseSubject = "api_response"
        val oneTimeLinkLifeSpan: Duration = Duration.ofMinutes(10)
    }
}