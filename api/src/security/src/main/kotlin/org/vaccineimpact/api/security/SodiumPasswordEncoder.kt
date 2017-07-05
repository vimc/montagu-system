package org.vaccineimpact.api.security

import org.abstractj.kalium.NaCl
import org.abstractj.kalium.crypto.Password
import org.abstractj.kalium.encoders.Encoder
import org.pac4j.core.credentials.password.PasswordEncoder

class SodiumPasswordEncoder : PasswordEncoder
{
    private val passwordHelper = Password()

    override fun encode(password: String)
            = passwordHelper.hash(password.toByteArray(),
            Encoder.HEX,
            NaCl.Sodium.CRYPTO_PWHASH_SCRYPTSALSA208SHA256_OPSLIMIT_INTERACTIVE,
            memoryLimit())

    override fun matches(plainPassword: String, encodedPassword: String)
            = passwordHelper.verify(
            Encoder.HEX.decode(encodedPassword),
            plainPassword.toByteArray())

    // Max amount of memory to use
    private fun memoryLimit()
            = NaCl.Sodium.CRYPTO_PWHASH_SCRYPTSALSA208SHA256_MEMLIMIT_INTERACTIVE.toLong()

}