package org.vaccineimpact.api.models

data class Touchstone(
        override val id: String,
        val name: String,
        val version: Int,
        val description: String,
        val years: IntRange,
        val status: TouchstoneStatus
) : HasKey<String>

enum class TouchstoneStatus
{
    IN_PREPARATION,
    OPEN,
    FINISHED
}