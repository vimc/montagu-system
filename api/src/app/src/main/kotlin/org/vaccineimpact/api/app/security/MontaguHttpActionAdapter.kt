package org.vaccineimpact.api.app.security

import org.pac4j.sparkjava.DefaultHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.RequestLogger
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus

abstract class MontaguHttpActionAdapter(private val repositoryFactory: RepositoryFactory)
    : DefaultHttpActionAdapter()
{
    protected fun haltWithError(code: Int, context: SparkWebContext, errors: List<ErrorInfo>)
    {
        haltWithError(code, context, MontaguSerializer.instance.toJson(Result(ResultStatus.FAILURE, null, errors)))
    }

    protected fun haltWithError(code: Int, context: SparkWebContext, response: String)
    {
        addDefaultResponseHeaders(context.response)
        repositoryFactory.inTransaction { repos ->
            RequestLogger(repos.accessLogRepository).log(context)
        }
        spark.Spark.halt(code, response)
    }
}