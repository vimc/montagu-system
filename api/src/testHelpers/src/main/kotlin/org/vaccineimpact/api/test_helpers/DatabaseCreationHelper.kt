package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.UnableToConnectToDatabase

object DatabaseCreationHelper
{
    private var error: Exception? = null
    private val templateDbName = Config["testdb.template_name"]
    private val dbName = Config["db.name"]

    fun createTemplateFromDatabase()
    {
        checkDatabaseExists(dbName)
        JooqContext(dbName = "postgres").use {
            it.dsl.query("ALTER DATABASE $dbName RENAME TO $templateDbName").execute()
        }
        println("Created template database by renaming $dbName to $templateDbName")
        checkDatabaseExists(templateDbName)
    }

    fun restoreDatabaseFromTemplate()
    {
        JooqContext(dbName = "postgres").use {
            it.dsl.query("ALTER DATABASE $templateDbName RENAME TO $dbName").execute()
        }
        checkDatabaseExists(dbName)
    }

    fun checkDatabaseExists(dbName: String): Unit
    {
        if (!databaseExists(dbName))
        {
            throw error!!
        }
    }

    private fun databaseExists(dbName: String): Boolean
    {
        println("Checking that database '$dbName' exists...")
        var attemptsRemaining = 10
        while (attemptsRemaining > 0)
        {
            if (check(dbName))
            {
                return true
            }
            else
            {
                println("Unable to connect. I will wait and then retry $attemptsRemaining more times")
                attemptsRemaining--
                Thread.sleep(2000)
            }
        }
        return false
    }

    fun check(dbName: String): Boolean
    {
        try
        {
            JooqContext(dbName = dbName).close()
            return true
        }
        catch (e: UnableToConnectToDatabase)
        {
            error = e
            return false
        }
    }
}