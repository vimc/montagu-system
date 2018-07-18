package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.models.CohortRestriction
import org.vaccineimpact.api.models.Expectations

fun exampleExpectations() = Expectations(
        years = 2000..2100,
        ages = 0..99,
        cohorts = CohortRestriction(null, null),
        countries = emptyList(),
        outcomes = emptyList()
)