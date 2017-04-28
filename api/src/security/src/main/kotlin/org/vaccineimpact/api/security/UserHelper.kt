package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.APP_USER
import java.security.SecureRandom
import java.util.*

object UserHelper
{
    fun saveUser(username: String, name: String, email: String, plainPassword: String)
    {
        val salt = newSalt()
        JooqContext().use {
            it.dsl.newRecord(APP_USER).apply {
                this.username = username
                this.name = name
                this.email = email
                this.passwordHash = hashedPassword(plainPassword, salt)
                this.salt = salt
            }.store()
        }
    }

    fun encoder(salt: String) = BasicSaltedSha512PasswordEncoder(salt)

    private fun hashedPassword(plainPassword: String, salt: String) = encoder(salt).encode(plainPassword)

    private fun newSalt(): String
    {
        val saltBytes = ByteArray(32)
        SecureRandom().nextBytes(saltBytes)
        return Base64.getEncoder().encodeToString(saltBytes)
    }

    fun suggestUsername(name: String): String
    {
        val names = name.toLowerCase().split(' ')
        var username = names.first()
        if (names.size > 1)
        {
            username = "${username}.${names.last()}"
        }
        return username
    }
}