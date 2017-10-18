package org.vaccineimpact.api.app.controllers.endpoints

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.StreamedResponse
import org.vaccineimpact.api.app.serialization.Serializer
import org.vaccineimpact.api.app.serialization.StreamSerializable

fun <TRepository> ((ActionContext, TRepository) -> StreamSerializable).streamed()
    : (ActionContext, TRepository) -> StreamedResponse
{
    return { context, repo ->
        val data = this(context, repo)
        context.streamedResponse { stream ->
            data.serialize(stream, Serializer.instance)
        }
    }
}