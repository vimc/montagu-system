package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.StreamSerializable

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