package org.vaccineimpact.api.models

data class CoverageSet(
        override val id: Int,
        val touchstone: String,
        val name: String,
        val vaccine: String,
        val gaviSupportLevel: String,
        val activityType: String
): HasKey<Int>

data class ScenarioAndCoverageSets(
        val scenario: Scenario,
        val coverageSets: List<CoverageSet>
)

data class ScenarioTouchstoneAndCoverageSets(
        val touchstone: Touchstone,
        val scenario: Scenario,
        val coverageSets: List<CoverageSet>
)