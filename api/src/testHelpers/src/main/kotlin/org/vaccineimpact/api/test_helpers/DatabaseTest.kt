package org.vaccineimpact.api.test_helpers

import org.jooq.impl.TableImpl
import org.junit.After
import org.junit.Before
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.fieldsAsList

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