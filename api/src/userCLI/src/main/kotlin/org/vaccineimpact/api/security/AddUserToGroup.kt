package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.MODELLING_GROUP
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.ReifiedRole
import kotlin.system.exitProcess

sealed class GroupDefinition
{
    abstract fun getGroups(db: JooqContext): Iterable<String>

    class GroupList(val groups: List<String>): GroupDefinition()
    {
        override fun getGroups(db: JooqContext) = groups
    }
    class AllGroups: GroupDefinition()
    {
        override fun getGroups(db: JooqContext): Iterable<String>
        {
            return db.dsl.select(MODELLING_GROUP.ID)
                    .from(MODELLING_GROUP)
                    .fetch()
                    .map { it[MODELLING_GROUP.ID] }
        }
    }
}

class AddUserToGroupOptions(
        val username: String,
        val groups: GroupDefinition
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
                exitProcess(0)
            }
            val username = args[0]
            val groups = if (args[1] == "ALL")
            {
                GroupDefinition.AllGroups()
            }
            else
            {
                GroupDefinition.GroupList(args.drop(1))
            }
            return AddUserToGroupOptions(username, groups)
        }
    }
}

fun addToGroup(args: List<String>)
{
    AddUserToGroupOptions.parseArgs(args).run {
        JooqContext().use { db ->
            for (group in groups.getGroups(db))
            {
                val role = ReifiedRole("member", Scope.Specific("modelling-group", group))
                db.ensureUserHasRole(username, role)
                println("Gave role $role '$username'")
            }
        }
    }
}