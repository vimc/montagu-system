package org.vaccineimpact.api.models

interface Expectations
{
    val id: Int
    val description: String
    val years: IntRange
    val ages: IntRange
    val cohorts: CohortRestriction
    val outcomes: List<Outcome>
}