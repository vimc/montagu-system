package org.vaccineimpact.api.blackboxTests

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
        db.addGroup("group-1", "description")
        db.addScenarioDescription("scenario-1", "description 1", "disease-1", addDisease = true)
        db.addScenarioDescription("scenario-2", "description 2", "disease-2", addDisease = true)
        db.addTouchstone("touchstone", 1, "Touchstone v1", "open", 1900..2000, addName = true, addStatus = true)
        db.addTouchstone("touchstone", 2, "Touchstone v2", "open", 1900..2000)
        val setId = db.addResponsibilitySet("group-1", "touchstone-1", "submitted", addStatus = true)
        db.addResponsibility(setId, "touchstone-1", "scenario-1")
        db.addResponsibility(setId, "touchstone-1", "scenario-2")

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