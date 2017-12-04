package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.StreamSerializable

// Old style endpoints
fun <TRepository> ((ActionContext, TRepository) -> StreamSerializable<*>).streamed()
        : (ActionContext, TRepository) -> Unit
{
    return { context, repo -> stream(this(context, repo), context) }
}

// New style endpoints
fun Endpoint.streamed(): Endpoint
{
    return this.copy(postProcess = ::streamIfStreamable)
}
fun streamIfStreamable(data: Any?, context: ActionContext): Any?
{
    if (data is StreamSerializable<*>)
    {
        return stream(data, context)
    }
    else
    {
        val typeName = data?.javaClass ?: "unknown"
        throw Exception("Attempted to stream '$data' ($typeName), but it is not StreamSerializable")
    }
}

fun stream(data: StreamSerializable<*>, context: ActionContext, serializer: Serializer = MontaguSerializer.instance) =
        context.streamedResponse(data.contentType) { stream ->
            data.serialize(stream, serializer)
        }