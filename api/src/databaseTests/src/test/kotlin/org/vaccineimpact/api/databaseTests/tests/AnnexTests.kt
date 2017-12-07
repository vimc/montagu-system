package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.AnnexJooqContext
import org.vaccineimpact.api.db.annex.Tables.BURDEN_ESTIMATE_STOCHASTIC
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.test_helpers.MontaguTests

class AnnexTests : MontaguTests()
{
    @Test
    fun `can connect to annex`()
    {
        AnnexJooqContext().use { db ->
            val records = db.dsl
                    .select(BURDEN_ESTIMATE_STOCHASTIC.fieldsAsList())
                    .from(BURDEN_ESTIMATE_STOCHASTIC)
            assertThat(records).isEmpty()
        }
    }
}