package org.vaccineimpact.api.app.requests

import org.vaccineimpact.api.app.context.RequestDataSource
import org.vaccineimpact.api.app.errors.WrongDataFormatError
import org.vaccineimpact.api.models.helpers.ContentTypes
import org.vaccineimpact.api.serialization.DataTableDeserializer
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.serialization.Serializer
import kotlin.reflect.KClass

open class PostDataHelper(private val serializer: Serializer = MontaguSerializer.instance)
{
    open fun <T : Any> csvData(from: RequestDataSource, klass: KClass<T>): Sequence<T>
    {
        val (contents, contentType) = from.getContent()
        if (contentType != null && contentType !in ContentTypes.acceptableCSVTypes)
        {
            throw WrongDataFormatError(contentType, ContentTypes.csv)
        }
        return DataTableDeserializer.deserialize(contents, klass, serializer)
    }
}

inline fun <reified T : Any> PostDataHelper.csvData(from: RequestDataSource) = this.csvData(from, T::class)