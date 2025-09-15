package org.vaccineimpact.api.app.errors

import org.vaccineimpact.api.models.ErrorInfo
import kotlin.reflect.KClass

class UnknownObjectError(val id: Any, val typeName: String) : MontaguError(404, listOf(
        ErrorInfo("unknown-${mangleTypeName(typeName)}", "Unknown ${mangleTypeName(typeName)} with id '$id'")
))
{
    constructor(id: Any, type: KClass<*>)
            : this(id, type.simpleName ?: "unknown-type")

    companion object
    {
        fun mangleTypeName(typeName: String) = typeName
                .replace(Regex("[A-Z]"), { "-" + it.value.lowercase() })
                .trim('-')
    }
}
