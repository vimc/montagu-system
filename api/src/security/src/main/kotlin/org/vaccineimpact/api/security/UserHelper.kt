package org.vaccineimpact.api.security

import org.jooq.DSLContext
import org.pac4j.core.credentials.password.PasswordEncoder
import org.vaccineimpact.api.db.Tables.APP_USER

object UserHelper
{
    val encoder: PasswordEncoder = SodiumPasswordEncoder()

    fun saveUser(db: DSLContext, username: String, name: String, email: String, plainPassword: String)
    {
        db.newRecord(APP_USER).apply {
            this.username = username
            this.name = name
            this.email = email
            this.passwordHash = hashedPassword(plainPassword)
        }.store()
    }

    private fun hashedPassword(plainPassword: String) = encoder.encode(plainPassword)

    fun suggestUsername(name: String): String
    {
        val names = name.toLowerCase().split(' ')
        var username = names.first()
        if (names.size > 1)
        {
            username = "$username.${names.last()}"
        }
        return username
    }
}