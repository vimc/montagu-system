package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.getResource
import java.io.File
import java.security.KeyFactory
import java.security.KeyPair
import java.security.PrivateKey
import java.security.PublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec

object KeyHelper
{
    private val keyFactory = KeyFactory.getInstance("RSA")

    val keyPair by lazy {
        val path = firstPathThatExistsFrom(listOf(
                "/etc/montagu/api/token_key",
                getResource("").path + "token_key"
        ))
        KeyPair(loadPublicKey(path), loadPrivateKey(path))
    }

    private fun loadPublicKey(path: String): PublicKey
    {
        val keyBytes = File(path, "public_key.der").readBytes()
        val spec = X509EncodedKeySpec(keyBytes)
        return keyFactory.generatePublic(spec)
    }

    private fun loadPrivateKey(path: String): PrivateKey
    {
        val file = File(path, "private_key.der")
        try
        {
            val keyBytes = file.readBytes()
            val spec = PKCS8EncodedKeySpec(keyBytes)
            return keyFactory.generatePrivate(spec)
        }
        finally
        {
            // Don't leave the private key lying around once we've read it
            file.delete()
        }
    }

    private fun firstPathThatExistsFrom(paths: List<String>): String
    {
        return paths.firstOrNull { File(it, "public_key.der").exists() }
            ?: throw MissingTokenKeyPairException(paths)
    }
}