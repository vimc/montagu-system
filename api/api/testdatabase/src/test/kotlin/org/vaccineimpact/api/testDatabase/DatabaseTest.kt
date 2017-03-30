package org.vaccineimpact.api.testDatabase

import org.junit.AfterClass
import org.junit.BeforeClass
import org.vaccineimpact.api.tests.MontaguTests

abstract class DatabaseTest : MontaguTests()
{
    companion object {
        @BeforeClass @JvmStatic
        fun setupTestEnvironment()
        {
            TestDatabaseManager.startDatabase()
        }

        @AfterClass @JvmStatic
        fun teardownTestEnvironment()
        {
            TestDatabaseManager.stopDatabase()
        }
    }
}