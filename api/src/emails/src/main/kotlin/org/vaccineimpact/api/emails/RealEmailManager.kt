package org.vaccineimpact.api.emails

import org.simplejavamail.email.Email
import org.simplejavamail.mailer.Mailer
import org.simplejavamail.mailer.config.ServerConfig
import org.simplejavamail.mailer.config.TransportStrategy
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.security.BasicUserProperties
import javax.mail.Message

class RealEmailManager : EmailManager
{
    private val logger: Logger = LoggerFactory.getLogger(RealEmailManager::class.java)

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
        logger.info("mail sent to: ${recipient.email}")

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