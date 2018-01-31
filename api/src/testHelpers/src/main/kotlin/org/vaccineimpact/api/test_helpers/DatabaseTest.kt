package org.vaccineimpact.api.test_helpers

import org.junit.After
import org.junit.Before
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.JooqContext

abstract class DatabaseTest : MontaguTests()
{
    private val userName = Config["db.username"]
    protected open val usesAnnex = false

    @Before
    fun createDatabase()
    {
        DatabaseCreationHelper.main.createDatabaseFromTemplate()
        if (usesAnnex)
        {
            DatabaseCreationHelper.annex.createDatabaseFromTemplate()
        }
    }

    @After
    fun dropDatabase()
    {
        DatabaseCreationHelper.main.dropDatabase()
        if (usesAnnex)
        {
            DatabaseCreationHelper.annex.dropDatabase()
        }
    }
}

data class DatabaseConfig(
        val factory: (String) -> JooqContext,
        val name: String,
        val templateName: String
)