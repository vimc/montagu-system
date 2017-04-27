package org.vaccineimpact.api.security

import org.vaccineimpact.api.models.User
import java.security.SecureRandom
import java.util.*

object UserHelper
{
    fun makeUser(username: String, name: String, email: String, plainPassword: String): User
    {
        val salt = newSalt()
        return User(username, name, email, hashedPassword(plainPassword, salt), salt, null)
    }

    fun encoder(salt: String) = BasicSaltedSha512PasswordEncoder(salt)

    private fun hashedPassword(plainPassword: String, salt: String) = encoder(salt).encode(plainPassword)

    private fun newSalt(): String
    {
        val saltBytes = ByteArray(32)
        SecureRandom().nextBytes(saltBytes)
        return Base64.getEncoder().encodeToString(saltBytes)
    }
}