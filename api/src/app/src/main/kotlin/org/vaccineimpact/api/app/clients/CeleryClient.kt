package org.vaccineimpact.api.app.clients

import com.geneea.celery.Celery
import com.google.common.util.concurrent.ListenableFuture
import org.vaccineimpact.api.db.Config

typealias CeleryTaskResult = Map<String, Map<String, Boolean>>
typealias CeleryTaskArguments = Array<out Any>

interface TaskQueueClient
{
    fun runDiagnosticReport(group: String, disease: String, touchstone: String, uploaderEmail: String): Any
}

class CeleryClient : TaskQueueClient
{
    private val broker = Config["celery.broker"]
    private val backend = Config["celery.backend"]
    private val client = Celery.builder()
            .brokerUri(broker)
            .backendUri(backend)
            .build()

    override fun runDiagnosticReport(group: String, disease: String, touchstone: String, uploaderEmail: String):
            ListenableFuture<CeleryTaskResult>
    {
        val args = arrayOf(group, disease, touchstone, uploaderEmail) as CeleryTaskArguments
        return client.submit<CeleryTaskResult>("run-diagnostic-reports", args)
    }
}
