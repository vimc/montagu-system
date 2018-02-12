package org.vaccineimpact.api.app.security

import org.pac4j.core.context.WebContext
import org.pac4j.core.credentials.UsernamePasswordCredentials
import org.pac4j.core.credentials.authenticator.Authenticator
import org.pac4j.core.exception.CredentialsException
import org.pac4j.core.profile.CommonProfile
import org.pac4j.core.util.CommonHelper
import org.vaccineimpact.api.app.repositories.jooq.JooqUserRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.security.InternalUser
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
                this.adapted().internalUser = user
            }
        }
    }

    private fun validate(email: String, password: String): InternalUser
    {
        return JooqContext().use { db ->
            val repo = JooqUserRepository(db.dsl)
            val user = repo.getUserByEmail(email)
            if (user == null)
            {
                throw CredentialsException("Unknown email '$email'")
            }
            else
            {
                if (user.passwordHash == null)
                {
                    throwsException("User does not have a password")
                }
                if (!UserHelper.encoder.matches(password, user.passwordHash))
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
