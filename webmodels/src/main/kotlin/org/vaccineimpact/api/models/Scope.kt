package org.vaccineimpact.api.models

sealed class Scope(val value: String)
{
    class Global : Scope("*")
    {
        // Global scope is greater than or equal to all other scopes
        override fun encompasses(other: Scope) = true
    }

    class Specific(val scopePrefix: String, val scopeId: String): Scope("$scopePrefix:$scopeId")
    {
        override fun encompasses(other: Scope): Boolean = when (other)
        {
        // Global scope is larger than any specific scope
            is Global -> false

        // Different specific scopes are not ordered relative to each other, so only return true if they are indentical
            is Specific -> equals(other)
        }
    }

    override fun toString() = value
    override fun equals(other: Any?) = when(other) {
        is Scope -> other.toString() == toString()
        else -> false
    }
    override fun hashCode() = toString().hashCode()

    abstract fun encompasses(other: Scope): Boolean

    companion object
    {
        fun parse(rawScope: String): Scope
        {
            if (rawScope == "*")
            {
                return Global()
            }
            else
            {
                val parts = rawScope.split(':')
                return Specific(parts[0], parts[1])
            }
        }
    }
}