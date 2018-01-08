package org.vaccineimpact.api.app

import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.serialization.MontaguSerializer
import spark.Spark

class NotFoundHandler
{
    fun setup()
    {
        Spark.notFound { _, res ->
            addDefaultResponseHeaders(res)
            val result = Result(
                    ResultStatus.FAILURE,
                    null,
                    listOf(
                            ErrorInfo("unknown-resource", "Unknown resource. Please check the URL")
                    )
            )
            MontaguSerializer.instance.toJson(result)
        }
    }
}