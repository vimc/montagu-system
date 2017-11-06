package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import org.vaccineimpact.api.serialization.StreamSerializable

fun <TRepository> ((ActionContext, TRepository) -> StreamSerializable<*>).streamed()
        : (ActionContext, TRepository) -> Unit
{
    return { context, repo -> stream(this(context, repo), context) }
}

fun stream(data: StreamSerializable<*>, context: ActionContext, serializer: Serializer = MontaguSerializer.instance) =
        context.streamedResponse(data.contentType) { stream ->
            data.serialize(stream, serializer)
        }