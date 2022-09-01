package org.vaccineimpact.api.app.security

import org.pac4j.core.exception.http.HttpAction
import org.pac4j.sparkjava.SparkHttpActionAdapter
import org.pac4j.sparkjava.SparkWebContext
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.models.ErrorInfo
import org.vaccineimpact.api.models.Result
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer

abstract class MontaguHttpActionAdapter(private val repositoryFactory: RepositoryFactory,
                                        protected val serializer: Serializer = MontaguSerializer.instance)
    : SparkHttpActionAdapter()
{
    protected fun haltWithError(action: HttpAction, context: SparkWebContext, errors: List<ErrorInfo>)
    {
        haltWithError(action, context, serializer.toJson(Result(ResultStatus.FAILURE, null, errors)))
    }

    protected fun haltWithError(action: HttpAction,  context: SparkWebContext, response: String)
    {
        addDefaultResponseHeaders(context.sparkRequest, context.sparkResponse)
        spark.Spark.halt(action.code, response)
    }
}