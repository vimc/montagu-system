package org.vaccineimpact.api.security

import org.vaccineimpact.api.models.Scope
import kotlin.system.exitProcess

class AddRoleOptions(
        val username: String,
        val roleName: String,
        val scope: Scope
)
{
    companion object
    {
        fun parseArgs(args: List<String>): AddRoleOptions
        {
            if (args.size != 2 && args.size != 3)
            {
                println("Usage: ./user.sh addRole USERNAME ROLE_NAME [ROLE_SCOPE_PREFIX:SCOPE_ID]")
                println("For roles that have no scope prefix, leave off the last two arguments")
                exitProcess(0)
            }

            val username = args[0]
            val roleName = args[1]
            var scope: Scope = Scope.Global()
            if (args.size == 3)
            {
                scope = Scope.parse(args[2])
            }
            return AddRoleOptions(username, roleName, scope)
        }

    }
}