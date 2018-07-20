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
        listOf("yf-scenario")
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