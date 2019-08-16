package org.vaccineimpact.api.models.expectations

import org.vaccineimpact.api.models.Outcome

interface Expectations
{
    val id: Int
    val description: String
    val years: IntRange
    val ages: IntRange
    val cohorts: CohortRestriction
    val outcomes: List<Outcome>
}