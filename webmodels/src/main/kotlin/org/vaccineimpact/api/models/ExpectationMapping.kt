package org.vaccineimpact.api.models

data class ExpectationMapping(
        override val expectation: CountryOutcomeExpectations,
        override val applicableScenarios: List<String>,
        override val disease: String
): AppliedExpectation