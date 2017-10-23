package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext
import kotlin.system.exitProcess

data class NewUser(
        val name: String,
        val username: String,
        val email: String,
        val password: String,
        val alwaysCreate: Boolean = true
)
{
    companion object
    {
        fun fromArgs(args: List<String>): NewUser
        {
            val conditionalCreate = args.size == 5 && args[4] == "--if-not-exists"
            return NewUser(args[0], args[1], args[2], args[3], !conditionalCreate)
        }
    }
}

fun addUser(args: List<String>)
{
    val user = when (args.size) {
        0 -> getInteractively()
        4,5 -> NewUser.fromArgs(args)
        else -> {
            println("Usage: ./user.sh add [FULL_NAME USERNAME EMAIL PASSWORD [--if-not-exists]]")
            println("Leave off all arguments to add user interactively")
            exitProcess(0)
        }
    }

    try
    {
        JooqContext().use {
            if (user.alwaysCreate || !UserHelper.userExists(it.dsl, user.username))
            {
                UserHelper.saveUser(it.dsl, user.username, user.name, user.email, user.password)
                println("Saved user '${user.username}' to the database")
            }
            else
            {
                println("User with username '${user.username}' already exists; no changes made")
            }
        }
    }
    catch (e: Exception)
    {
        println("An error occurred saving the user to the database:")
        println(e)
    }
}

private fun getInteractively(): NewUser {
    println("Fill in the following fields to add a new user to the database:")
    val name = Question("Full name").ask()
    val username = Question("Username", default = UserHelper.suggestUsername(name)).ask()
    val email = Question("Email address", default = "$username@imperial.ac.uk").ask()
    val password = PasswordQuestion("Password").ask()
    return NewUser(name, username, email, password)
}