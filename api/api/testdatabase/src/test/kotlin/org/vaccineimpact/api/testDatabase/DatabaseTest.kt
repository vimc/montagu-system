package org.vaccineimpact.api.testDatabase

import org.junit.BeforeClass
import org.vaccineimpact.api.app.errors.UnableToConnectToDatabaseError
import org.vaccineimpact.api.app.repositories.jooq.JooqContext
import org.vaccineimpact.api.tests.MontaguTests

abstract class DatabaseTest : MontaguTests()
{
    companion object {
        @BeforeClass @JvmStatic
        fun setupTestEnvironment()
        {
            if (!DatabaseChecker.databaseExists)
            {
                throw DatabaseChecker.error!!
            }
        }
    }
}

object DatabaseChecker
{
    val databaseExists: Boolean by lazy {
        checkDatabaseExists()
    }
    var error: Exception? = null

    fun checkDatabaseExists(): Boolean
    {
        println("Checking that database exists...")
        var attemptsRemaining = 10
        while (attemptsRemaining > 0)
        {
            if (check()) {
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

    private fun check(): Boolean
    {
        try
        {
            JooqContext()
            return true
        }
        catch (e: UnableToConnectToDatabaseError)
        {
            error = e
            return false
        }
    }
}