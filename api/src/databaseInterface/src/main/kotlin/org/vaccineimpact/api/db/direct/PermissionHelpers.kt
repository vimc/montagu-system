package org.vaccineimpact.api.db.direct

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList

fun JooqContext.givePermissionsToUserUsingTestRole(
        username: String,
        scopePrefix: String?,
        scopeId: String,
        permissions: List<String>)
{
    val testRoleId = this.getOrCreateRole("test_role_$scopeId", scopePrefix, "Test role")
    this.ensureUserHasRole(username, testRoleId, scopeId = scopeId)
    this.setRolePermissions(testRoleId, permissions)
}

fun JooqContext.clearRolesForUser(username: String)
{
    dsl.deleteFrom(USER_ROLE).where(USER_ROLE.USERNAME.eq(username)).execute()
}

fun JooqContext.createPermissions(permissions: List<String>)
{
    val records = permissions.map {
        dsl.newRecord(PERMISSION).apply { name = it }
    }
    dsl.batchStore(records).execute()
}

fun JooqContext.setRolePermissions(roleId: Int, permissions: List<String>, createPermissions: Boolean = false)
{
    if (createPermissions)
    {
        createPermissions(permissions)
    }
    dsl.deleteFrom(ROLE_PERMISSION).where(ROLE_PERMISSION.ROLE.eq(roleId)).execute()
    val records = permissions.map { permission ->
        dsl.newRecord(ROLE_PERMISSION).apply {
            this.role = roleId
            this.permission = permission
        }
    }
    dsl.batchStore(records).execute()
}

fun JooqContext.getOrCreateRole(name: String, scopePrefix: String?, description: String): Int
{
    val id = getRole(name, scopePrefix)
    if (id != null)
    {
        return id
    }
    else
    {
        return createRole(name, scopePrefix, description)
    }
}

fun JooqContext.getRole(name: String, scopePrefix: String?): Int?
{
    val role = dsl.select(ROLE.ID)
            .from(ROLE)
            .where(ROLE.NAME.eq(name))
            // Dealing with SQLs ternary NULL logic - this is just an equality check
            .and(ROLE.SCOPE_PREFIX.isNotDistinctFrom(scopePrefix))
            .fetchAny()
    return role?.get(ROLE.ID)
}

fun JooqContext.createRole(name: String, scopePrefix: String?, description: String): Int
{
    val role = dsl.newRecord(ROLE).apply {
        this.name = name
        this.scopePrefix = scopePrefix
        this.description = description
    }
    role.store()
    return role.id
}

fun JooqContext.ensureUserHasRole(username: String, roleId: Int, scopeId: String)
{
    val roleMapping = dsl.select(USER_ROLE.fieldsAsList())
            .from(USER_ROLE)
            .where(USER_ROLE.USERNAME.eq(username))
            .and(USER_ROLE.ROLE.eq(roleId))
            .and(USER_ROLE.SCOPE_ID.eq(scopeId))
            .fetchAny()
    if (roleMapping == null)
    {
        dsl.newRecord(USER_ROLE).apply {
            this.username = username
            this.role = roleId
            this.scopeId = scopeId
        }.store()
    }
}