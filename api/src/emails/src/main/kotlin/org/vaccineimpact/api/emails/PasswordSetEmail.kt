package org.vaccineimpact.api.emails

class PasswordSetEmail(val token: String, val recipientName: String): MustacheEmail()
{
    override val subject = "Password change"
    override val textTemplate = "password-set.txt"
    override val htmlTemplate = "password-set.html"

    override val values = mapOf(
            "name" to recipientName,
            "token" to token
    )
}