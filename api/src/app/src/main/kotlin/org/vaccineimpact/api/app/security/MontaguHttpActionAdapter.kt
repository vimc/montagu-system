package org.vaccineimpact.api.app.security

import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.RequestLogger
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus

abstract class MontaguHttpActionAdapter(private val accessLogRepository: () -> AccessLogRepository)
    : DefaultHttpActionAdapter()
{
    protected fun haltWithError(code: Int, context: SparkWebContext, errors: List<ErrorInfo>)
    {
        haltWithError(code, context, Serializer.instance.toJson(Result(ResultStatus.FAILURE, null, errors)))
    }

    protected fun haltWithError(code: Int, context: SparkWebContext, response: String)
    {
        addDefaultResponseHeaders(context.response)
        RequestLogger(accessLogRepository).log(context)
        spark.Spark.halt(code, response)
    }
}