package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.app.DefaultHeadersFilter
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Route
import spark.Spark
import spark.route.HttpMethod

data class Endpoint<TRoute>(
        override val urlFragment: String,
        override val route: TRoute,
        override val routeWrapper: (TRoute) -> Route,
        override val method: HttpMethod = HttpMethod.get,
        override val contentType: String = ContentTypes.json,
        private val additionalSetupCallback: ((String, WebTokenHelper) -> Unit)? = null
) : EndpointDefinition<TRoute>
{
    init
    {
        if (!urlFragment.endsWith("/"))
        {
            throw Exception("All endpoint definitions must end with a forward slash: $urlFragment")
        }
    }

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        Spark.after(url, contentType, DefaultHeadersFilter(contentType))
        additionalSetupCallback?.invoke(url, tokenHelper)
    }

    override fun transform(x: Any) = when (x)
    {
        is SplitData<*, *> -> x.serialize(Serializer.instance)
        is DataTable<*> -> x.serialize(Serializer.instance)
        is AuthenticationResponse -> Serializer.instance.gson.toJson(x)!!
        else -> Serializer.instance.toResult(x)
    }

    fun withAdditionalSetup(newCallback: (String, WebTokenHelper) -> Unit): Endpoint<TRoute>
    {
        return this.copy(additionalSetupCallback = { url, tokenHelper ->
            this.additionalSetupCallback?.invoke(url, tokenHelper)
            newCallback(url, tokenHelper)
        })
    }
}