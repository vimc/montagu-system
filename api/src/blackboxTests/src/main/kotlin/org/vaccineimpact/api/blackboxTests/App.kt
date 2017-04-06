package org.vaccineimpact.api.blackboxTests

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

fun main(args: Array<String>) {
    JooqContext().use {
        it.addGroup("group-1", "description")
        it.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        it.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        it.addTouchstone("touchstone", 1, "open", "Touchstone v1", 1900..2000, addName = true, addStatus = true)
        it.addTouchstone("touchstone", 2, "open", "Touchstone v2", 1900..2000, addName = true, addStatus = true)
        val setId = it.addResponsibilitySet("group-1", "touchstone-1", "submitted", addStatus = true)
        it.addResponsibility(setId, "touchstone-1", "scenario-1")
        it.addResponsibility(setId, "touchstone-1", "scenario-2")
    }
}