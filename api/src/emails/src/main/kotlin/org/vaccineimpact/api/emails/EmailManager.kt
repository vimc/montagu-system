package org.vaccineimpact.api.emails

import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.BasicUserProperties

interface EmailManager
{
    fun sendEmail(data: EmailData, recipient: BasicUserProperties)
}

fun getEmailManager(): EmailManager
{
    val mode = Config["email.mode"]
    return when (mode)
    {
        "real" -> RealEmailManager()
        "disk" -> WriteToDiskEmailManager()
        else -> throw Exception("Unknown email mode '$mode'")
    }
}