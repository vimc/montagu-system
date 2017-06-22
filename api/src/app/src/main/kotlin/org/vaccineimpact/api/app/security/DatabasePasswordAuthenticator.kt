package eden.martin.webapi.security

import org.pac4j.core.context.WebContext
import org.pac4j.core.credentials.UsernamePasswordCredentials
import org.pac4j.core.credentials.authenticator.Authenticator
import org.pac4j.core.exception.CredentialsException
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.util.CommonHelper
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.app.security.USER_OBJECT
import org.vaccineimpact.api.security.MontaguUser
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
            val email = credentials.username
            val password = credentials.password
            if (CommonHelper.isBlank(email))
            {
                throwsException("Username cannot be blank")
            }
            if (CommonHelper.isBlank(password))
            {
                throwsException("Password cannot be blank")
            }
            val user = validate(email, password)
            credentials.userProfile = CommonProfile().apply {
                setId(email)
                addAttribute(USER_OBJECT, user)
            }
        }
    }

    private fun validate(email: String, password: String): MontaguUser
    {
        return JooqUserRepository().use { repo ->
            val user = repo.getMontaguUserByEmail(email)
            if (user == null)
            {
                throw CredentialsException("Unknown email '$email'")
            }
            else
            {
                val encoder = UserHelper.encoder(user.salt)
                if (!encoder.matches(password, user.passwordHash))
                {
                    throwsException("Provided password does not match password on record")
                }
                user
            }
        }
    }

    private fun throwsException(message: String)
    {
        throw CredentialsException(message)
    }
}
