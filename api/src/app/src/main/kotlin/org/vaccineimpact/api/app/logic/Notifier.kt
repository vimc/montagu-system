package org.vaccineimpact.api.app.logic

import org.slf4j.LoggerFactory
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.models.helpers.ContentTypes

interface Notifier
{
    fun notify(message: String)
}

class SlackNotifier(private val client: HttpClient = KHttpClient(),
                    private val appConfig: ConfigWrapper = Config) : Notifier
{
    private val logger = LoggerFactory.getLogger(SlackNotifier::class.java)
    override fun notify(message: String)
    {
        try
        {
            val headers = mapOf("Content-type" to ContentTypes.json)
            client.post(appConfig["slack.url"], headers, mapOf("text" to message))
        }
        catch (e: Exception)
        {
            logger.warn("There was a problem sending the Slack message: ${e.message}")
        }
    }
}
