package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.ensureUserHasRole
import org.vaccineimpact.api.db.direct.getRole

fun addRole(args: List<String>)
{
    AddRoleOptions.parseArgs(args).run {
        JooqContext().use { db ->
            val roleId = db.getRole(roleName, scopePrefix)
                    ?: throw ActionException("No role exists with name '$roleName' and scope prefix '$scopePrefix'")
            db.ensureUserHasRole(username, roleId, scopeId)
        }
        println("Gave role $scope/$roleName to '$username'")
    }
}