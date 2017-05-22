package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.Serializer
import org.vaccineimpact.api.security.WebTokenHelper
import spark.route.HttpMethod

typealias Transformer<T> = (x: T) -> String

open class BasicEndpoint<out T: Any>(
        override val urlFragment: String,
        override val route: (ActionContext) -> T,
        override val method: HttpMethod = HttpMethod.get,
        private val additionalSetupCallback: ((String) -> Unit)? = null,
        transformer: Transformer<T>? = null
): EndpointDefinition<T>
{
    private val transformer = transformer ?: Serializer::toResult

    init
    {
        if (!urlFragment.endsWith("/"))
        {
            throw Exception("All endpoint definitions must end with a forward slash: $urlFragment")
        }
    }

    override fun additionalSetup(url: String, tokenHelper: WebTokenHelper)
    {
        additionalSetupCallback?.invoke(url)
    }

    final override fun transform(x: Any): String
    {
        // We know x will always be T, as it is the output of route
        // We don't want to put T in the interface, as that would lose our covariant status
        @Suppress("UNCHECKED_CAST")
        return transformer(x as T)
    }
}