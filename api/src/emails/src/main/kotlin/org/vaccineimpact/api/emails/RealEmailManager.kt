package org.vaccineimpact.api.emails

import org.simplejavamail.email.Email
import org.simplejavamail.mailer.Mailer
import org.simplejavamail.mailer.config.ServerConfig
import org.simplejavamail.mailer.config.TransportStrategy
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.BasicUserProperties
import org.vaccineimpact.api.security.MontaguUser
import javax.mail.Message

class RealEmailManager : EmailManager
{
    override fun sendEmail(data: EmailData, recipient: BasicUserProperties)
    {
        val mailer = Mailer(
                ServerConfig(server, port, username, password),
                TransportStrategy.SMTP_TLS
        )
        val email = Email().apply {
            addRecipient(recipient.name, recipient.email, Message.RecipientType.TO)
            setFromAddress("Montagu notifications", sender)
            subject = data.subject
            text = data.text()
            textHTML = data.html()
        }
        mailer.sendMail(email)
    }

    companion object
    {
        val server = Config["email.server"]
        val port = Config.getInt("email.port")
        val sender = Config["email.sender"]
        val username = Config["email.username"]
        val password = Config["email.password"]
    }
}