package org.vaccineimpact.api.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.db.Config
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.interfaces.RSAKey
import java.time.Duration
import java.time.Instant
import java.util.*

class WebTokenHelper
{
    private val logger = LoggerFactory.getLogger(WebTokenHelper::class.java)

    val lifeSpan: Duration = Duration.ofSeconds(Config["token.lifespan"].toLong())
    private val keyPair = generateKeyPair()
    private val issuer = Config["token.issuer"]
    private val verifier = JWT.require(Algorithm.RSA256(verificationKey))
            .withIssuer(issuer)
            .build()

    fun generateToken(username: String): String
    {
        val algorithm = Algorithm.RSA256(signingKey)
        return JWT.create()
                .withIssuer(issuer)
                .withSubject(username)
                .withExpiresAt(Date.from(Instant.now().plus(lifeSpan)))
                .sign(algorithm)
    }

    fun verifyToken(token: String): MontaguToken
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
    }

    private val signingKey
        get() = keyPair.private as RSAKey

    private val verificationKey
        get() = keyPair.public as RSAKey

    private fun generateKeyPair(): KeyPair
    {
        val generator = KeyPairGenerator.getInstance("RSA").apply {
            initialize(1024)
        }
        return generator.generateKeyPair()
    }
}