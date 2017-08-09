package org.vaccineimpact.api.db

import org.vaccineimpact.api.db.Tables.*

private data class Role(
        val name: String,
        val scopePrefix: String?,
        val description: String,
        val permissions: List<String>
)

object StandardRoles
{
    fun insertInto(db: JooqContext)
    {
        val roles = listOf(
                Role("user", null, "Log in", listOf("can-login", "scenarios.read", "countries.read", "modelling-groups.read", "models.read", "touchstones.read", "responsibilities.read", "users.read", "estimates.read", "reports.read")),
                Role("touchstone-preparer", null, "Prepare touchstones", listOf("diseases.write", "vaccines.write", "scenarios.write", "countries.write", "touchstones.prepare", "responsibilities.write", "coverage.read")),
                Role("touchstone-reviewer", null, "Review touchstones before marking as 'open'", listOf("touchstones.open", "coverage.read")),
                Role("coverage-provider", null, "Upload coverage data", listOf("coverage.read", "coverage.write")),
                Role("user-manager", null, "Manage users and permissions", listOf("users.create", "users.edit-all", "roles.read", "roles.write", "modelling-groups.write")),
                Role("estimates-reviewer", null, "Review uploaded burden estimates", listOf("estimates.review", "estimates.read-unfinished")),
                Role("reports-reviewer", null, "Choose which reports to publish (and can view unpublished reports)", listOf("reports.read", "reports.review")),
                Role("member", "modelling-group", "Member of the group", listOf("estimates.read-unfinished", "coverage.read", "demographics.read")),
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