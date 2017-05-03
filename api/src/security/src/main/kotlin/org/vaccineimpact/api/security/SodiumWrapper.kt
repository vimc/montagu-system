package org.vaccineimpact.api.security

import org.libsodium.jni.Sodium

object SodiumWrapper
{
    fun hashedPasswordLength() = Sodium.crypto_pwhash_scryptsalsa208sha256_strbytes()

    fun hashPassword(password: String): String
    {
        val hashedPasswordWithSalt = ByteArray(hashedPasswordLength())
        val passwordBytes = password.toByteArray()

        if (Sodium.crypto_pwhash_scryptsalsa208sha256_str(
                hashedPasswordWithSalt,
                passwordBytes,
                passwordBytes.size,
                operationsLimit(),
                memoryLimit()
        ) != 0)
        {
            throw Exception("Unable to calculate password hash - Probably ran out of memory")
        }
        return hashedPasswordWithSalt.toString(Charsets.US_ASCII)
    }

    fun verifyPassword(plainPassword: String, hashedPasswordWithSalt: String): Boolean
    {
        val result = Sodium.crypto_pwhash_scryptsalsa208sha256_str_verify(
                hashedPasswordWithSalt.toByteArray(Charsets.US_ASCII),
                plainPassword.toByteArray(),
                plainPassword.length
        )
        return when (result)
        {
            0 -> true
            else -> false
        }
    }

    // Max amount of memory to use
    private fun memoryLimit()
            = Sodium.crypto_pwhash_scryptsalsa208sha256_memlimit_interactive()

    // Max amount of computation to perform
    private fun operationsLimit()
            = Sodium.crypto_pwhash_scryptsalsa208sha256_opslimit_interactive()
}