package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.ensureUserHasRole
import org.vaccineimpact.api.db.direct.getRole
import kotlin.system.exitProcess

fun addRole(args: List<String>)
{
    if (args.size != 2 && args.size != 4)
    {
        println("Usage: ./user.sh addRole USERNAME ROLE_NAME [ROLE_SCOPE_PREFIX SCOPE_ID]")
        println("For roles that have no scope prefix, leave off the last two arguments")
        exitProcess(0)
    }
    val username = args[0]
    val roleName = args[1]
    var scopePrefix: String? = null
    var scopeId = ""
    if (args.size == 4)
    {
        scopePrefix = args[2]
        scopeId = args[3]
    }
    JooqContext().use { db ->
        val roleId = db.getRole(roleName, scopePrefix)
                ?: throw ActionException("No role exists with name '$roleName' and scope prefix '$scopePrefix'")
        db.ensureUserHasRole(username, roleId, scopeId)
    }
}