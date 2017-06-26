package org.vaccineimpact.api.app.serialization

import com.github.salomonbrys.kotson.jsonSerializer
import com.google.gson.JsonObject
import org.vaccineimpact.api.models.User

val userSerializer = jsonSerializer<User> {
    val json = Serializer.instance.baseGson.toJsonTree(it.src) as JsonObject
    if (it.src.roles == null)
    {
        json.remove("roles")
    }
    json
}