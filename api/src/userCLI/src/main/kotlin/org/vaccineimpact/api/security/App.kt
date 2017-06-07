package org.vaccineimpact.api.security

import kotlin.system.exitProcess

fun main(args: Array<String>)
{
    val action = getAction(args)
    try
    {
        val args = args.drop(1)
        when (action)
        {
            Action.add -> addUser(args)
            Action.addRole -> addRole(args)
        }
    }
    catch (e: ActionException)
    {
        println(e.message)
        exitProcess(-1)
    }
}

fun getAction(args: Array<String>): Action
{
    if (args.isEmpty())
    {
        println("An action is required. ./user.sh ACTION")
        println("ACTION must be one of " + enumValues<Action>().joinToString())
        exitProcess(0)
    }
    return enumValueOf(args.first())
}