package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.RSASignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import java.security.KeyPair
import java.security.SecureRandom
import java.time.Duration
import java.time.Instant
import java.util.*

open class WebTokenHelper(
        keyPair: KeyPair,
        private val serializer: Serializer = MontaguSerializer.instance)
{
    open val defaultLifespan: Duration = Duration.ofSeconds(Config["token.lifespan"].toLong())
    val signatureConfiguration = RSASignatureConfiguration(keyPair)
    val generator = JwtGenerator<CommonProfile>(signatureConfiguration)
    val issuer = Config["token.issuer"]
    private val random = SecureRandom()

    open fun generateToken(user: InternalUser, lifeSpan: Duration = defaultLifespan): String
    {
        return generator.generate(claims(user, lifeSpan))
    }

    open fun generateOnetimeActionToken(
            url: String,
            username: String,
            permissions: String,
            roles: String,
            duration: Duration? = null
    ): String
    {
        return generator.generate(mapOf(
                "iss" to issuer,
                "token_type" to TokenType.ONETIME,
                "sub" to username,
                "exp" to Date.from(Instant.now().plus(duration ?: oneTimeLinkLifeSpan)),
                "permissions" to permissions,
                "roles" to roles,
                "url" to url,
                "nonce" to getNonce()
        ))
    }

    open fun encodeResult(result: Result): String
    {
        val json = serializer.toJson(result)
        return generator.generate(
                mapOf("sub" to apiResponseSubject,
                        "iss" to issuer,
                        "token_type" to TokenType.API_RESPONSE,
                        "result" to json))
    }

    fun claims(user: InternalUser, lifeSpan: Duration = defaultLifespan): Map<String, Any>
    {
        return mapOf(
                "iss" to issuer,
                "token_type" to TokenType.BEARER,
                "sub" to user.username,
                "exp" to Date.from(Instant.now().plus(lifeSpan)),
                "permissions" to user.permissions.joinToString(","),
                "roles" to user.roles.joinToString(",")
        )
    }

    private fun modelReviewClaims(user: InternalUser): Map<String, Any>
    {
        val modelsToReview = getReviewersMap()[user.username]?.
                map{ it to "true"}
                ?.toMap()?: mapOf()

        return mapOf(
                "iss" to issuer,
                "token_type" to TokenType.MODEL_REVIEW,
                "sub" to user.username,
                "exp" to Date.from(Instant.now().plus(defaultLifespan))
        ) + modelsToReview
    }

    open fun verify(compressedToken: String, expectedType: TokenType,
                    oneTimeTokenChecker: OneTimeTokenChecker): Map<String, Any>
    {
        val authenticator = when (expectedType)
        {
            TokenType.ONETIME -> OneTimeTokenAuthenticator(this, oneTimeTokenChecker)
            else -> MontaguTokenAuthenticator(this, expectedType)
        }
        return authenticator.validateTokenAndGetClaims(compressedToken)
    }

    private fun getNonce(): String
    {
        val bytes = ByteArray(32)
        random.nextBytes(bytes)
        return Base64.getEncoder().encodeToString(bytes)
    }

    companion object
    {
        val apiResponseSubject = "api_response"
        val oneTimeLinkLifeSpan: Duration = Duration.ofMinutes(10)
    }

    open fun generateModelReviewToken(internalUser: InternalUser): String
    {
        return generator.generate(modelReviewClaims(internalUser))
    }
}