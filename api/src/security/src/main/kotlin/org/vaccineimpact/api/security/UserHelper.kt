package org.vaccineimpact.api.security

import org.pac4j.core.credentials.password.PasswordEncoder
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.APP_USER

object UserHelper
{
    val encoder: PasswordEncoder = SodiumPasswordEncoder()

    fun saveUser(username: String, name: String, email: String, plainPassword: String)
    {
        JooqContext().use {
            it.dsl.newRecord(APP_USER).apply {
                this.username = username
                this.name = name
                this.email = email
                this.passwordHash = hashedPassword(plainPassword)
            }.store()
        }
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