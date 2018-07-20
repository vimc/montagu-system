package org.vaccineimpact.api.models

data class ExpectationMapping(
        val expectation: Expectations,
        val applicableScenarios: List<String>
)
