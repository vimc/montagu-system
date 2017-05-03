package org.vaccineimpact.api.security

import org.pac4j.core.credentials.password.PasswordEncoder

class SodiumPasswordEncoder : PasswordEncoder
{
    override fun encode(password: String)
            = SodiumWrapper.hashPassword(password)

    override fun matches(plainPassword: String, encodedPassword: String)
            = SodiumWrapper.verifyPassword(plainPassword, encodedPassword)
}