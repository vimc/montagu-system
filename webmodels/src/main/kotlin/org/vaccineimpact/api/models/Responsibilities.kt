package org.vaccineimpact.api.models

data class ResponsibilitiesAndTouchstoneStatus(
        val responsibilities: Responsibilities,
        val touchstoneStatus: TouchstoneStatus
)

data class Responsibilities(
        val touchstone: String,
        val problems: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}

data class Responsibility(
        val scenario: Scenario,
        val status: ResponsibilityStatus,
        val problems: List<String>,
        val currentEstimate: BurdenEstimate?
)

enum class ResponsibilitySetStatus
{
    INCOMPLETE,
    SUBMITTED,
    APPROVED
}

enum class ResponsibilityStatus
{
    EMPTY,
    INVALID,
    VALID
}