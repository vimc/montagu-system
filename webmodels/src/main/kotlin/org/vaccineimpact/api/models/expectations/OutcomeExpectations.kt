package org.vaccineimpact.api.models.expectations

import org.vaccineimpact.api.models.Outcome

data class OutcomeExpectations(override val id: Int,
                               override val description: String,
                               override val years: IntRange,
                               override val ages: IntRange,
                               override val cohorts: CohortRestriction,
                               override val outcomes: List<Outcome>): Expectations
