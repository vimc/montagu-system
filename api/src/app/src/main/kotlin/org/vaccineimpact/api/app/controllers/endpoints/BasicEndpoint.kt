package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.ContentTypes
import org.vaccineimpact.api.app.DefaultHeadersFilter
import org.vaccineimpact.api.app.addDefaultResponseHeaders
import org.vaccineimpact.api.app.serialization.DataTable
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.SplitData
import org.vaccineimpact.api.models.AuthenticationResponse
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Filter
import spark.Request
import spark.Response
import spark.Spark
import spark.route.HttpMethod

open class BasicEndpoint(
        override val urlFragment: String,
        override val route: (ActionContext) -> Any,
        override val method: HttpMethod = HttpMethod.get,
        override val contentType: String = ContentTypes.json,
        private val additionalSetupCallback: ((String) -> Unit)? = null
): EndpointDefinition
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
        additionalSetupCallback?.invoke(url)
    }

    override fun transform(x: Any) = when(x)
    {
        is SplitData<*, *> -> x.serialize(Serializer.instance)
        is DataTable<*> -> x.serialize(Serializer.instance)
        is AuthenticationResponse -> Serializer.instance.gson.toJson(x)!!
        else -> Serializer.instance.toResult(x)
    }
}