package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.Responsibility
import org.vaccineimpact.api.models.responsibilities.ResponsibilityStatus

fun exampleExpectations() = Expectations(
        years = 2000..2100,
        ages = 0..99,
        cohorts = CohortRestriction(null, null),
        countries = emptyList(),
        outcomes = emptyList()
)

fun exampleResponsibility() = Responsibility(
        exampleScenario(),
        ResponsibilityStatus.EMPTY,
        emptyList(),
        null
)

fun exampleTouchstoneVersion() = TouchstoneVersion(
        id = "touchstone-1",
        name = "touchstone",
        version = 1,
        description = "Some example touchstone version",
        status = TouchstoneStatus.OPEN
)

fun exampleScenario() = Scenario(
        id = "yf-scenario",
        description = "Some example scenario",
        disease = "YF",
        touchstones = listOf("touchstone-1")
)