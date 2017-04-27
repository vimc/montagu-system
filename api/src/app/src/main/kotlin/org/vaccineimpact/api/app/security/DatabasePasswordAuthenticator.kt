package eden.martin.webapi.security

import org.pac4j.core.context.Pac4jConstants
import org.pac4j.core.context.WebContext
import org.pac4j.core.credentials.UsernamePasswordCredentials
import org.pac4j.core.credentials.authenticator.Authenticator
import org.pac4j.core.exception.CredentialsException
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.util.CommonHelper
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.security.UserHelper

class DatabasePasswordAuthenticator : Authenticator<UsernamePasswordCredentials>
{
    override fun validate(credentials: UsernamePasswordCredentials?, context: WebContext?)
    {
        if (credentials == null)
        {
            throwsException("No credentials supplied")
        }
        else
        {
            val username = credentials.username
            val password = credentials.password
            if (CommonHelper.isBlank(username))
            {
                throwsException("Username cannot be blank")
            }
            if (CommonHelper.isBlank(password))
            {
                throwsException("Password cannot be blank")
            }
            validate(username, password)
            credentials.userProfile = CommonProfile().apply {
                setId(username)
                addAttribute(Pac4jConstants.USERNAME, username)
            }
        }
    }

    private fun validate(username: String, password: String)
    {
        JooqUserRepository().use { repo ->
            val user = repo.getUserByUsername(username)
            if (user == null)
            {
                throwsException("Unknown username '$username'")
            }
            else
            {
                val encoder = UserHelper.encoder(user.salt)
                if (!encoder.matches(password, user.passwordHash))
                {
                    throwsException("Provided password does not match password on record")
                }
            }
        }
    }

    private fun throwsException(message: String)
    {
        throw CredentialsException(message)
    }
}
