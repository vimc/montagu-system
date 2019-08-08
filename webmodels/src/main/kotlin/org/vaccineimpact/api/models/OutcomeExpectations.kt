package org.vaccineimpact.api.models

data class OutcomeExpectations(override val id: Int,
                               override val description: String,
                               override val years: IntRange,
                               override val ages: IntRange,
                               override val cohorts: CohortRestriction,
                               override val outcomes: List<String>): Expectations