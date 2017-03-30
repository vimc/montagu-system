package org.vaccineimpact.api.tests

import org.junit.Test
import org.vaccineimpact.api.app.Config

class ConfigTests : MontaguTests()
{
    @Test
    fun `all expected fields are present`()
    {
        val keys = listOf(
                "db.host",
                "db.port",
                "db.name",
                "db.username",
                "db.password"
        )
        for (key in keys)
        {
            Config[key]
        }
    }
}