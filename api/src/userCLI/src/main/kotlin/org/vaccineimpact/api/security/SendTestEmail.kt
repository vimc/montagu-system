package org.vaccineimpact.api.security

import org.simplejavamail.email.Email
import org.simplejavamail.mailer.Mailer
import org.simplejavamail.mailer.config.ServerConfig
import org.simplejavamail.mailer.config.TransportStrategy
import java.lang.ProcessBuilder.Redirect.PIPE
import javax.mail.Message
import kotlin.system.exitProcess

// This only needs to stick around until we have a real email implementation
// somewhere - this is just a proof of concept.
fun sendTestEmail(args: List<String>)
{
    val to = getRecipient(args)
    val password = getPassword()

    val mailer = Mailer(
            ServerConfig("smtp.cc.ic.ac.uk", 587, "montagu", password),
            TransportStrategy.SMTP_TLS
    )
    val email = Email().apply {
        addNamedToRecipients("Unknown recipient", to)
        setFromAddress("Montagu Notifications", "montagu@imperial.ac.uk")
        subject = "Test email"
        text = "If you are reading this, the test email was sent correctly."
    }
    mailer.sendMail(email)
}

private fun getRecipient(args: List<String>): String
{
    if (args.size != 1)
    {
        println("Please provide the first part of a valid Imperial email.")
        println("e.g. `sendTestEmail j.bloggs` if you want to email j.bloggs@imperial.ac.uk")
        exitProcess(0)
    }

    val to = "${args.first()}@imperial.ac.uk"
    return to
}

// This is just the quickest way for me to get Vault integration
// working. What we should actually do is probably just get the
// password from the config file, and that should be retrieved
// from the vault and put into the config file during the deployment
// process.
private fun getPassword() = ProcessBuilder(listOf("vault", "read", "-field=value", "secret/email/password"))
        .redirectOutput(PIPE)
        .start()
        .inputStream.bufferedReader().readText()