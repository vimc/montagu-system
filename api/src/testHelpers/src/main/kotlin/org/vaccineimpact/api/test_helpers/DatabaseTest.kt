package org.vaccineimpact.api.test_helpers

import org.junit.After
import org.junit.Before
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.JooqContext

abstract class DatabaseTest : MontaguTests()
{
    private val userName = Config["db.username"]

    @Before
    fun createDatabase()
    {
        DatabaseCreationHelper.main.createDatabaseFromTemplate()
    }

    @After
    fun dropDatabase()
    {
        DatabaseCreationHelper.main.dropDatabase()
    }

    protected fun <T> withDatabase(doThis: (JooqContext) -> T): T
    {
        return JooqContext().use { doThis(it) }
    }
}

data class DatabaseConfig(
        val factory: (String) -> JooqContext,
        val name: String,
        val templateName: String
)