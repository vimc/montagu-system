package org.vaccineimpact.api.app.security

import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.security.deflated
import java.time.Duration

open class OneTimeTokenGenerator(
        private val tokenRepository: TokenRepository,
        private val tokenHelper: WebTokenHelper = WebTokenHelper(KeyHelper.keyPair))
{

    open fun getOneTimeLinkToken(url: String, profile: CommonProfile): String
    {
        val attributes = profile.attributes
        val permissions = attributes["permissions"].toString()
        val roles = attributes["roles"].toString()
        val token = tokenHelper.generateOnetimeActionToken(
                url, profile.id, permissions, roles
        )
        tokenRepository.storeToken(token)
        return token.deflated()
    }

    open fun getSetPasswordToken(user: InternalUser): String
    {
        val token = tokenHelper.generateOnetimeActionToken("/v1/password/set/",
                user.username,
                user.permissions.joinToString(","),
                user.roles.joinToString(","),
                Duration.ofDays(1))
        tokenRepository.storeToken(token)
        return token.deflated()
    }
}