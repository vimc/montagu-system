package uk.ac.imperial.vimc.demo.app.models

data class Responsibilities(
        val group: ModellingGroup,
        val responsibilities: List<Responsibility>,
        val complete: Boolean) : Iterable<Responsibility>
{
    override fun iterator() = responsibilities.iterator()
}

data class Responsibility(val scenario: Scenario)