package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.models.ErrorInfo

sealed class DeserializedValue
{
    class Value(val value: Any?) : DeserializedValue()
    class Error(val errorInfo: ErrorInfo): DeserializedValue()
}