package uk.ac.imperial.vimc.demo.app.models

data class Responsibilities(
        val group: ModellingGroup,
        val responsibilities: List<Scenario>,
        val complete: Boolean) : Iterable<Scenario>
{
    override fun iterator() = responsibilities.iterator()
}