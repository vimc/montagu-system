package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.JooqContext

fun main(args: Array<String>)
{
    println("Fill in the following fields to add a new user to the database:")
    val name = Question("Full name").ask()
    val username = Question("Username", default = UserHelper.suggestUsername(name)).ask()
    val email = Question("Email address", default = "$username@imperial.ac.uk").ask()
    val password = PasswordQuestion("Password").ask()
    try
    {
        JooqContext().use {
            UserHelper.saveUser(it.dsl, username, name, email, password)
        }
        println("Saved user '$username' to the database")
    }
    catch (e: Exception)
    {
        println("An error occurred saving the user to the database:")
        println(e)
    }
}