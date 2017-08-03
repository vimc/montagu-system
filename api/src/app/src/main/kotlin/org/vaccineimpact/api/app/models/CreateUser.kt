package org.vaccineimpact.api.app.models

import org.vaccineimpact.api.app.serialization.AllowedFormat

class CreateUser(
        username: String,
        val name: String,
        email: String
)
{
    @AllowedFormat("""\w+(\.\w+)*""", "word.word")
    val username = username

    // Note that this Regex is deliberately very permissive - we're just trying to catch
    // users who have accidentally typed something other than an email address
    @AllowedFormat("""[^@]+@[^@]+""", "email@example.com")
    val email = email
}