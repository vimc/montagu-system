package org.vaccineimpact.api.generateTestData

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.*

/** The more important source set here is blackboxTests/src/test - that actually contains the
 * Black box tests. This "main" source set is just a place to put a little script you can
 * run to set up the database in a given state for manual testing. It's expected this code
 * changes frequently to allow developers to run arbitrary code against their development db.
 */
fun main(args: Array<String>) {
    JooqContext().use { db ->
        db.addDisease("YF", "Yellow Fever")
        db.addVaccine("YF", "Yellow Fever")
        db.addSupportLevels("none", "without", "with")
        db.addActivityTypes("none", "routine", "campaign")

        db.addScenarioDescription("yf-routine", "Yellow Fever, routine", "YF")
        db.addScenarioDescription("yf-campaign", "Yellow Fever, campaign", "YF")

        db.addTouchstoneName("op-2017", "Operational Forecast 2017")
        db.addTouchstone("op-2017", 1, "Operational Forecast 2017 (v1)", "finished", 1900..2000, addStatus = true)
        db.addTouchstone("op-2017", 2, "Operational Forecast 2017 (v2)", "open", 1900..2000, addStatus = true)
        val yfRoutine = db.addScenarioToTouchstone("op-2017-2", "yf-routine")
        val yfCampaign = db.addScenarioToTouchstone("op-2017-2", "yf-campaign")

        val yfNoVacc = db.addCoverageSet("op-2017-2", "Yellow Fever, no vaccination", "YF", "none", "none")
        val yfRoutineWithout = db.addCoverageSet("op-2017-2", "Yellow Fever, routine, without GAVI", "YF", "without", "routine")
        val yfRoutineWith = db.addCoverageSet("op-2017-2", "Yellow Fever, routine, with GAVI", "YF", "with", "routine")
        val yfCampaignWithout = db.addCoverageSet("op-2017-2", "Yellow Fever, campaign, without GAVI", "YF", "without", "campaign")
        val yfCampaignWith = db.addCoverageSet("op-2017-2", "Yellow Fever, campaign, with GAVI", "YF", "with", "campaign")
        db.generateCoverageData(yfNoVacc)
        db.generateCoverageData(yfRoutineWithout)
        db.generateCoverageData(yfRoutineWith)
        db.generateCoverageData(yfCampaignWithout)
        db.generateCoverageData(yfCampaignWith)

        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfNoVacc, 0)
        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfRoutineWithout, 1)
        db.addCoverageSetToScenario("yf-routine", "op-2017-2", yfRoutineWith, 2)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfNoVacc, 0)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfRoutineWithout, 1)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfRoutineWith, 2)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfCampaignWithout, 3)
        db.addCoverageSetToScenario("yf-campaign", "op-2017-2", yfCampaignWith, 4)

        db.addGroup("IC-Garske", "Imperial Yellow Fever modelling group")
        db.addGroup("IC-Imaginary", "Imperial speculative modelling group")
        val setId = db.addResponsibilitySet("IC-Garske", "op-2017-2", "incomplete", addStatus = true)
        db.addResponsibility(setId, yfRoutine)
        db.addResponsibility(setId, yfCampaign)

        val roles = listOf(
                Role("user", null, "Log in", listOf("can-login", "scenarios.read", "countries.read", "modelling-groups.read", "models.read", "touchstones.read", "responsibilities.read", "users.read", "estimates.read")),
                Role("touchstone-preparer", null, "Prepare touchstones", listOf("diseases.write", "vaccines.write", "scenarios.write", "countries.write", "touchstones.prepare", "responsibilities.write", "coverage.read")),
                Role("touchstone-reviewer", null, "Review touchstones before marking as 'open'", listOf("touchstones.open", "coverage.read")),
                Role("coverage-provider", null, "Upload coverage data", listOf("coverage.read", "coverage.write")),
                Role("user-manager", null, "Manage users and permissions", listOf("users.create", "users.edit-all", "roles.read", "roles.write", "modelling-groups.write")),
                Role("estimates-reviewer", null, "Review uploaded burden estimates", listOf("estimates.review", "estimates.read-unfinished")),
                Role("member", "modelling-group", "Member of the group", listOf("estimates.read-unfinished", "coverage.read")),
                Role("uploader", "modelling-group", "Upload burden estimates", listOf("estimates.write")),
                Role("submitter", "modelling-group", "Mark burden estimates as complete", listOf("estimates.submit")),
                Role("user-manager", "modelling-group", "Manage group members and permissions", listOf("modelling-groups.manage-members", "users.create", "roles.write")),
                Role("model-manager", "modelling-group", "Add new models and model versions", listOf("models.write"))
        )
        val permissions = roles.flatMap { it.permissions }.distinct().map {
            db.dsl.newRecord(PERMISSION).apply { name = it }
        }
        db.dsl.batchStore(permissions).execute()

        for (role in roles)
        {
            val record = db.dsl.newRecord(ROLE).apply {
                name = role.name
                scopePrefix = role.scopePrefix
                description = role.description
            }
            record.store()
            val mappings = role.permissions.map { permission ->
                db.dsl.newRecord(ROLE_PERMISSION).apply {
                    this.role = record.id
                    this.permission = permission
                }
            }
            db.dsl.batchStore(mappings).execute()
        }
    }
}

private data class Role(
        val name: String,
        val scopePrefix: String?,
        val description: String,
        val permissions: List<String>
)