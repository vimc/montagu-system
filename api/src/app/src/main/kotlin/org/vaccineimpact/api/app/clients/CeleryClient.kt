package org.vaccineimpact.api.app.clients

import com.geneea.celery.Celery
import com.google.common.util.concurrent.ListenableFuture
import org.vaccineimpact.api.db.Config
import java.time.Instant
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

typealias CeleryTaskResult = Map<String, Map<String, Boolean>>
typealias CeleryTaskArguments = Array<out Any>

interface TaskQueueClient
{
    fun runDiagnosticReport(group: String,
                            disease: String,
                            touchstone: String,
                            scenario: String,
                            uploaderEmail: String): Any
}

class CeleryClient : TaskQueueClient
{
    private val broker = Config["celery.broker"]
    private val backend = Config["celery.backend"]
    private val client = Celery.builder()
            .brokerUri(broker)
            .backendUri(backend)
            .build()

    override fun runDiagnosticReport(group: String, disease: String, touchstone: String, scenario: String, uploaderEmail: String):
            ListenableFuture<CeleryTaskResult>
    {
        val utcTime = Instant.now().truncatedTo(ChronoUnit.SECONDS).toString().replace("Z", "")
        val args = arrayOf(group, disease, touchstone, utcTime, scenario, uploaderEmail) as CeleryTaskArguments
        return client.submit<CeleryTaskResult>("run-diagnostic-reports", args)
    }
}
