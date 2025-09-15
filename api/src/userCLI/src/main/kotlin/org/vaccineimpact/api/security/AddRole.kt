package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.permissions.ReifiedRole

fun addRole(args: List<String>)
{
    AddRoleOptions.parseArgs(args).run {
        JooqContext().use { db ->
            try
            {
                db.ensureUserHasRole(username, ReifiedRole(roleName, scope))
            }
            catch (e: UnknownRoleException)
            {
                throw ActionException("No role exists with name '$roleName' and scope prefix '${scope.databaseScopePrefix}'")
            }
        }
        println("Gave role $scope/$roleName to '$username'")
    }
}