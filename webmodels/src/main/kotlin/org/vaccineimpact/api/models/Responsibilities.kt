package org.vaccineimpact.api.models

data class ResponsibilitiesAndTouchstoneStatus(
        val responsibilities: Responsibilities,
        val touchstoneStatus: TouchstoneStatus
)

data class Responsibilities(
        val touchstoneVersion: String,
        val problems: String,
        val status: ResponsibilitySetStatus?,
        val responsibilities: List<Responsibility>) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}

data class ResponsibilityAndTouchstone(
        val touchstoneVersion: TouchstoneVersion,
        val responsibility: Responsibility
)

data class Responsibility(
        val scenario: Scenario,
        val status: ResponsibilityStatus,
        val problems: List<String>,
        val currentEstimateSet: BurdenEstimateSet?
)

data class ResponsibilitySet(
        val modellingGroupId: String,
        val touchstoneVersion: String,
        val status: ResponsibilitySetStatus,
        val responsibilities: List<Responsibility>
)

enum class ResponsibilitySetStatus
{
    NOT_APPLICABLE,
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