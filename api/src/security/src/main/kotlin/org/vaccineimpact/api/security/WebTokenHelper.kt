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

    //val publicKey: String = Base64.getUrlEncoder().encodeToString(keyPair.public.encoded)

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
                "permissions" to user.permissions.joinToString(","),
                "roles" to user.roles.joinToString(",")
        )
    }

    private fun generateKeyPair(): KeyPair
    {
        val generator = KeyPairGenerator.getInstance("RSA").apply {
            initialize(1024)
        }
        return generator.generateKeyPair()
    }
}