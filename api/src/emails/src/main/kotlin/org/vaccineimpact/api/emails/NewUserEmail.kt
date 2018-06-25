package org.vaccineimpact.api.emails

import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.BasicUserProperties

class NewUserEmail(
        val user: BasicUserProperties,
        val compressedToken: String
) : MustacheEmail()
{
    override val subject = "Welcome to Montagu"

    override val textTemplate = "new-user.txt"
    override val htmlTemplate = "new-user.html"
    override val values = mapOf(
            "name" to user.name,
            "token" to compressedToken,
            "support_address" to Config["contact.support"]
    )
}