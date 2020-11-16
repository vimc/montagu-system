package org.vaccineimpact.api.app.clients

import khttp.responses.Response
import org.vaccineimpact.api.app.logic.HttpClient
import org.vaccineimpact.api.app.logic.KHttpClient
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.helpers.ContentTypes
import java.time.Instant
import java.time.temporal.ChronoUnit

typealias CeleryTaskArguments = Array<out Any>

interface TaskQueueClient
{
    fun runDiagnosticReport(group: String,
                            disease: String,
                            touchstone: String,
                            scenario: String,
                            uploaderEmail: String): Any
}

class CeleryClient(private val httpClient: HttpClient = KHttpClient()): TaskQueueClient
{
    private val flowerHost= Config["celery.flower.host"]
    private val flowerPort = Config["celery.flower.port"]

    override fun runDiagnosticReport(group: String, disease: String, touchstone: String, scenario: String, uploaderEmail: String):
            Response
    {
        val utcTime = Instant.now().truncatedTo(ChronoUnit.SECONDS).toString().replace("Z", "")
        val args = arrayOf(group, disease, touchstone, utcTime, scenario, uploaderEmail) as CeleryTaskArguments
        val headers = mapOf("Content-type" to ContentTypes.json)


        val testUrl =  "http://$flowerHost:$flowerPort/api/task/types"
        val result = httpClient.get(testUrl, headers)

        val workers = httpClient.get("http://$flowerHost:$flowerPort/api/workers", headers)

        val url = "http://$flowerHost:$flowerPort/api/task/send-task/run-diagnostic-reports"

        return httpClient.post(url, headers, mapOf("args" to args))
    }
}
