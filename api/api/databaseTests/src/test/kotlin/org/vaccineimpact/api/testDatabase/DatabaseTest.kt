package org.vaccineimpact.api.databaseTests

import org.junit.After
import org.junit.Before
import org.junit.BeforeClass
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.app.errors.UnableToConnectToDatabaseError
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.test_helpers.MontaguTests

abstract class DatabaseTest : org.vaccineimpact.api.test_helpers.MontaguTests()
{

    @Before
    fun createDatabase()
    {
        JooqContext(dbName = "postgres").use {
            it.dsl.query("CREATE DATABASE $dbName TEMPLATE $templateDbName;").execute()
        }
        DatabaseChecker.checkDatabaseExists(dbName)
    }

    @After
    fun dropDatabase()
    {
        JooqContext(dbName = "postgres").use {
            it.dsl.query("DROP DATABASE $dbName").execute()
        }
    }

    companion object
    {
        private val templateDbName = Config["testdb.template_name"]
        private val dbName = Config["db.name"]

        @BeforeClass @JvmStatic
        fun setupTestEnvironment()
        {
            DatabaseChecker.checkDatabaseExists(templateDbName)
        }
    }
}

object DatabaseChecker
{
    private var error: Exception? = null

    fun checkDatabaseExists(dbName: String): Unit
    {
        if (!databaseExists(dbName))
        {
            throw error!!
        }
    }

    fun databaseExists(dbName: String): Boolean
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

    private fun check(dbName: String): Boolean
    {
        try
        {
            JooqContext(dbName = dbName).close()
            return true
        }
        catch (e: UnableToConnectToDatabaseError)
        {
            error = e
            return false
        }
    }
}