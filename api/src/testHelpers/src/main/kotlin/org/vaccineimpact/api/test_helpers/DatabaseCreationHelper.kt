package org.vaccineimpact.api.test_helpers

import org.vaccineimpact.api.db.AnnexJooqContext
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.UnableToConnectToDatabase

class DatabaseCreationHelper(private val config: DatabaseConfig)
{
    companion object
    {
        val main = DatabaseCreationHelper(
                DatabaseConfig({ JooqContext(it) }, Config["db.name"], Config["testdb.template_name"])
        )
        val annex = DatabaseCreationHelper(
                DatabaseConfig({ AnnexJooqContext(it) }, Config["annex.name"], Config["annex.template_name"])
        )
    }

    private var error: Exception? = null

    fun createTemplateFromDatabase()
    {
        println("Planning to create template ${config.templateName} from ${config.name}")
        checkDatabaseExists(config.name)
        if (databaseExists(config.templateName, maxAttempts = 1))
        {
            println("Template database already exists")
        }
        else
        {
            config.factory("postgres").use {
                it.dsl.query("ALTER DATABASE ${config.name} RENAME TO ${config.templateName}").execute()
            }
            println("Created template database by renaming ${config.name} to ${config.templateName}")
            checkDatabaseExists(config.templateName)
        }
    }

    fun restoreDatabaseFromTemplate()
    {
        config.factory("postgres").use {
            it.dsl.query("ALTER DATABASE ${config.templateName} RENAME TO ${config.name}").execute()
        }
        checkDatabaseExists(config.name)
    }

    fun createDatabaseFromTemplate()
    {
        config.factory("postgres").use {
            it.dsl.query("CREATE DATABASE ${config.name} TEMPLATE ${config.templateName};").execute()
        }
        DatabaseCreationHelper(config).checkDatabaseExists(config.name)
    }

    fun dropDatabase()
    {
        config.factory("postgres").use {
            it.dsl.query("DROP DATABASE ${config.name}").execute()
        }
    }

    fun checkDatabaseExists(dbName: String)
    {
        if (!databaseExists(dbName))
        {
            throw error!!
        }
    }

    private fun databaseExists(dbName: String, maxAttempts: Int = 10): Boolean
    {
        println("Checking that database '$dbName' exists...")
        var attemptsRemaining = maxAttempts
        while (attemptsRemaining > 0)
        {
            if (check(dbName))
            {
                return true
            }
            else
            {
                attemptsRemaining--
                if (attemptsRemaining > 0)
                {
                    println("Unable to connect. I will wait and then retry $attemptsRemaining more times")
                    Thread.sleep(2000)
                }
            }
        }
        return false
    }

    fun check(dbName: String): Boolean
    {
        try
        {
            config.factory(dbName).close()
            return true
        }
        catch (e: UnableToConnectToDatabase)
        {
            error = e
            return false
        }
    }
}