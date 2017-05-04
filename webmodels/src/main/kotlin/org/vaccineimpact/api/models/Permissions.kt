package org.vaccineimpact.api.models


// A permission is just a name, like 'coverage.read'
// To be useable, it must be reified with a scope, like:
// */coverage.read (for the global scope)
// modelling-group:IC-Garske/coverage.read (for a more specific scope)
data class ReifiedPermission(
        val name: String,
        val scope: Scope
)
{
    override fun toString() = "$scope/$name"
}

sealed class Scope(val value: String)
{
    class Global : Scope("*")
    class Specific(val scopePrefix: String, val scopeId: String): Scope("$scopePrefix:$scopeId")

    override fun toString() = value
    override fun equals(other: Any?) = when(other) {
        is Scope -> other.toString() == toString()
        else -> false
    }
}