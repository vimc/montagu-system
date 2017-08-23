package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.RSASignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import org.vaccineimpact.api.db.Config
import java.security.KeyPair
import java.security.SecureRandom
import java.time.Duration
import java.time.Instant
import java.util.*

open class WebTokenHelper(keyPair: KeyPair)
{
    open val lifeSpan: Duration = Duration.ofSeconds(Config["token.lifespan"].toLong())
    val oneTimeLinkLifeSpan: Duration = Duration.ofMinutes(10)
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
                                        lifeSpan: Duration = oneTimeLinkLifeSpan): String
    {
        return generator.generate(mapOf(
                "iss" to issuer,
                "sub" to oneTimeActionSubject,
                "exp" to Date.from(Instant.now().plus(lifeSpan)),
                "action" to action,
                "payload" to params.map { "${it.key}=${it.value}" }.joinToString("&"),
                "query" to queryString,
                "nonce" to getNonce()
        ))
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
    }
}