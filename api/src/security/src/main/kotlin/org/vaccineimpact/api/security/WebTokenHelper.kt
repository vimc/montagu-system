package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.RSASignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.User
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.time.Duration
import java.time.Instant
import java.util.*

class WebTokenHelper
{
    val lifeSpan: Duration = Duration.ofSeconds(Config["token.lifespan"].toLong())
    private val keyPair = generateKeyPair()
    val issuer = Config["token.issuer"]
    val signatureConfiguration = RSASignatureConfiguration(keyPair)
    val generator = JwtGenerator<CommonProfile>(signatureConfiguration)

    fun generateToken(user: User): String
    {
        return generator.generate(claims(user))
    }

    fun claims(user: User): Map<String, Any>
    {
        return mapOf(
                "iss" to issuer,
                "sub" to user.username,
                "exp" to Date.from(Instant.now().plus(lifeSpan)),
                "permissions" to user.permissions.joinToString(",")
        )
    }

    /*fun verifyToken(token: String): MontaguToken
    {
        val decoded = verifier.verify(token)
        if (decoded.issuer != issuer)
        {
            throw TokenValidationException("Issuer", issuer, decoded.issuer)
        }
        if (decoded.expiresAt < Date.from(Instant.now()))
        {
            throw TokenValidationException("Token has expired")
        }
        return MontaguToken(decoded.subject)
    }*/

    private fun generateKeyPair(): KeyPair
    {
        val generator = KeyPairGenerator.getInstance("RSA").apply {
            initialize(1024)
        }
        return generator.generateKeyPair()
    }
}