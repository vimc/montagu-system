package org.vaccineimpact.api.db

class AnnexJooqContext(dbName: String? = null) : JooqContext(dbName)
{
    override fun loadSettings() = DatabaseSettings.fromConfig(prefix = "annex")
}