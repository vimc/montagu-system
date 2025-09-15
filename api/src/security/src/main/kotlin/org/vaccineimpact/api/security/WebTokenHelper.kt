package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.RSASignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
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
    val generator = JwtGenerator(signatureConfiguration)
    val issuer = Config["token.issuer"]
    private val random = SecureRandom()

    open fun generateToken(user: InternalUser, lifeSpan: Duration = defaultLifespan): String
    {
        return generator.generate(claims(user, lifeSpan))
    }

    open fun generateUploadEstimatesToken(username: String,
                                          groupId: String,
                                          touchstoneVersionId: String,
                                          scenarioId: String,
                                          setId: Int): String
    {
        val claims = mapOf(
                "iss" to issuer,
                "token_type" to TokenType.UPLOAD,
                "sub" to username,
                "exp" to Date.from(Instant.now().plus(Duration.ofDays(1))),
                "group-id" to groupId,
                "scenario-id" to scenarioId,
                "set-id" to setId,
                "touchstone-id" to touchstoneVersionId,
                "uid" to "$setId-${Instant.now()}")

        return generator.generate(claims)
    }

    open fun generateOnetimeActionToken(
            url: String,
            username: String,
            duration: Duration? = null
    ): String
    {
        return generator.generate(mapOf(
                "iss" to issuer,
                "token_type" to TokenType.ONETIME,
                "sub" to username,
                "exp" to Date.from(Instant.now().plus(duration ?: oneTimeLinkLifeSpan)),
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
                "exp" to Date.from(Instant.now().plus(lifeSpan))
        )
    }

    private fun modelReviewClaims(user: InternalUser, diseaseNames: List<String>): Map<String, Any>
    {
        val diseasePermissions = diseaseNames
                .associate { it to "true" }

        val adminRoles = listOf("admin", "developer", "funder").map { ReifiedRole(it, Scope.Global()) }
        val access = if (user.roles.intersect(adminRoles).any())
        {
            "admin"
        }
        else
        {
            "user"
        }

        return mapOf(
                "iss" to issuer,
                "token_type" to TokenType.MODEL_REVIEW,
                "sub" to user.username,
                "exp" to Date.from(Instant.now().plus(defaultLifespan)),
                "access_level" to access
        ) + diseasePermissions
    }

    open fun verify(compressedToken: String, expectedType: TokenType): Map<String, Any>
    {
        val authenticator = when (expectedType)
        {
            TokenType.ONETIME -> throw UnsupportedOperationException("Please use verifyOneTimeToken")
            else -> MontaguTokenAuthenticator(this, expectedType)
        }
        try
        {
            return authenticator.validateTokenAndGetClaims(compressedToken)
        }
        catch (e: NullPointerException)
        {
            throw TokenValidationException("Could not verify token")
        }
    }

    open fun verifyOneTimeToken(compressedToken: String, oneTimeTokenChecker: OneTimeTokenChecker): Map<String, Any>
    {
        val authenticator = OneTimeTokenAuthenticator(this, oneTimeTokenChecker)
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

    open fun generateModelReviewToken(internalUser: InternalUser, diseaseNames: List<String>): String
    {
        return generator.generate(modelReviewClaims(internalUser, diseaseNames))
    }
}