package org.vaccineimpact.api.app.serialization

class PostDataHelper
{
    fun <T: Any> deserialize(body: String, klass: Class<T>): T
    {
        val model = Serializer.instance.fromJson(body, klass)
        return model
    }
}