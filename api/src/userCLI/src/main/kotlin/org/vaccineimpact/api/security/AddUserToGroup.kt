package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole

fun addToGroup(args: List<String>)
{
    AddUserToGroupOptions.parseArgs(args).run()
}

data class AddUserToGroupOptions(
        val username: String,
        val groups: Groups
)
{
    companion object
    {
        fun parseArgs(args: List<String>): AddUserToGroupOptions
        {
            if (args.size < 2)
            {
                println("Usage: ./user.sh addUserToGroup USERNAME GROUPS")
                println("GROUPS must either be a space-separated list of group IDs (or just one group ID)")
                println("or it must be 'ALL', which means add the user to every modelling group in the database")
                throw ActionException("")
            }
            else
            {
                val username = args[0]
                val groups = if (args[1] == "ALL")
                {
                    if (args.size > 2)
                    {
                        throw ActionException("Cannot combine the 'ALL' groups option with a list of groups")
                    }
                    Groups.AllGroups()
                }
                else
                {
                    Groups.GroupList(args.drop(1))
                }
                return AddUserToGroupOptions(username, groups)
            }
        }
    }

    fun run()
    {
        JooqContext().use { db ->
            for (group in groups.getGroups(db))
            {
                giveUserGroup(group, db)
            }
        }
    }

    fun giveUserGroup(group: String, db: JooqContext)
    {
        val role = ReifiedRole("member", Scope.Specific("modelling-group", group))
        db.ensureUserHasRole(username, role)
        println("Gave role $role '$username'")
    }
}