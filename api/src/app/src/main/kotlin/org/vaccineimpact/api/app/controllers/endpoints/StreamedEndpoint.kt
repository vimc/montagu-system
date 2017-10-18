package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.StreamSerializable

fun <TRepository, TData> ((ActionContext, TRepository) -> StreamSerializable<TData>).streamed()
        : (ActionContext, TRepository) -> Unit
{
    return { context, repo -> stream(this(context, repo), context) }
}

fun<TData> stream(data: StreamSerializable<TData>, context: ActionContext) =
        context.streamedResponse(data.contentType) { stream ->
            data.serialize(stream, Serializer.instance)
        }