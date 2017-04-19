package org.vaccineimpact.api.blackboxTests

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*

/** The more important source set here is blackboxTests/src/test - that actually contains the
 * Black box tests. This "main" source set is just a place to put a little script you can
 * run to set up the database in a given state for manual testing. It's expected this code
 * changes frequently to allow developers to run arbitrary code against their development db.
 */
fun main(args: Array<String>) {
    JooqContext().use {
        it.addGroup("group-1", "description")
        it.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        it.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        it.addTouchstone("touchstone", 1, "Touchstone v1", "open", 1900..2000, addName = true, addStatus = true)
        it.addTouchstone("touchstone", 2, "Touchstone v2", "open", 1900..2000)
        val setId = it.addResponsibilitySet("group-1", "touchstone-1", "submitted", addStatus = true)
        it.addResponsibility(setId, "touchstone-1", "scenario-1")
        it.addResponsibility(setId, "touchstone-1", "scenario-2")
    }
}