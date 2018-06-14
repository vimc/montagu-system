package org.vaccineimpact.api.security

import org.pac4j.core.profile.CommonProfile
import org.pac4j.jwt.config.signature.SignatureConfiguration
import org.pac4j.jwt.profile.JwtGenerator
import java.io.ByteArrayOutputStream
import java.util.*
import java.util.zip.GZIPOutputStream

interface TokenGenerator
{
    fun generate(claims: Map<String, Any?>): String
}

class CompressedJwtGenerator<TProfile>(signatureConfig: SignatureConfiguration) : TokenGenerator
        where TProfile : CommonProfile
{
    private val wrapped = JwtGenerator<TProfile>(signatureConfig)

    override fun generate(claims: Map<String, Any?>) = deflate(wrapped.generate(claims))
}