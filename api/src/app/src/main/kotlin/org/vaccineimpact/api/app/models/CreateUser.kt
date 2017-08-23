package org.vaccineimpact.api.app.models

import org.vaccineimpact.api.app.serialization.validation.AllowedFormat
import org.vaccineimpact.api.security.BasicUserProperties

private const val usernameChars = """[a-z]"""

data class CreateUser(
        @AllowedFormat("""$usernameChars+(\.$usernameChars+)*""", "word.word")
        override val username: String,

        override val name: String,

        // Note that this Regex is deliberately very permissive - we're just trying to catch
        // users who have accidentally typed something other than an email address
        @AllowedFormat("""[^@]+@[^@]+""", "email@example.com")
        override val email: String
) : BasicUserProperties