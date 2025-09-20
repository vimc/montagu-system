package org.vaccineimpact.api.models

data class Touchstone(
        override val id: String,
        val description: String,
        val comment: String,
        val versions: List<TouchstoneVersion>
): HasKey<String>

data class TouchstoneVersion(
        override val id: String,
        val name: String,
        val version: Int,
        val description: String,
        val status: TouchstoneStatus
) : HasKey<String>

enum class TouchstoneStatus
{
    IN_PREPARATION,
    OPEN,
    FINISHED
}