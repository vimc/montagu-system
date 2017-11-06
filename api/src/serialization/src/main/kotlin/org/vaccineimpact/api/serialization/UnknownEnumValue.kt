package org.vaccineimpact.api.serialization

class UnknownEnumValue(val name: String, val type: String)
    : Exception("Unable to parse '$name' as enum of type $type")