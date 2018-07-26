package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.*

fun exampleExpectations() = Expectations(
        id = 1,
        years = 2000..2100,
        ages = 0..99,
        cohorts = CohortRestriction(null, null),
        countries = emptyList(),
        outcomes = emptyList()
)

fun exampleExpectationMapping() = ExpectationMapping(
        exampleExpectations(),
        listOf("yf-scenario", "yf-scenario-2"),
        "YF"
)

fun exampleResponsibility() = Responsibility(
        exampleScenario(),
        ResponsibilityStatus.EMPTY,
        emptyList(),
        null
)

fun exampleTouchstoneVersion(
        id: String = "touchstone-1",
        status: TouchstoneStatus = TouchstoneStatus.OPEN
) = TouchstoneVersion(
        id = id,
        name = "touchstone",
        version = 1,
        description = "Some example touchstone version",
        status = status
)

fun exampleScenario() = Scenario(
        id = "yf-scenario",
        description = "Some example scenario",
        disease = "YF",
        touchstones = listOf("touchstone-1")
)

fun exampleResponsibilitySet(touchstoneVersionId: String, groupId: String) = ResponsibilitySet(
        touchstoneVersionId,
        groupId,
        ResponsibilitySetStatus.INCOMPLETE,
        listOf(exampleResponsibility(), exampleResponsibility())
)

fun exampleResponsibilitySetWithExpectations(touchstoneId: String, groupId: String) = ResponsibilitySetWithExpectations(
        touchstoneId,
        groupId,
        ResponsibilitySetStatus.INCOMPLETE,
        emptyList(),
        listOf(exampleExpectationMapping())
)