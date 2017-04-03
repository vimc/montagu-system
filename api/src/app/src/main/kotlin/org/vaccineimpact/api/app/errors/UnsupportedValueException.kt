package org.vaccineimpact.api.app.errors

class UnsupportedValueException(val value: Any)
    : Exception("Unsupported value '$value' of type '${value::class.simpleName}'")