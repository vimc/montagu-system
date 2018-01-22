package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.AnnexJooqContext
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.annex.Tables.BURDEN_ESTIMATE_STOCHASTIC
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AnnexTests : DatabaseTest()
{
    override val usesAnnex = true

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

    @Test
    fun `can read from annex via foreign table`()
    {
        JooqContext().use { db ->
            val records = db.dsl
                    .select(BURDEN_ESTIMATE_STOCHASTIC.fieldsAsList())
                    .from(BURDEN_ESTIMATE_STOCHASTIC)
            assertThat(records).isEmpty()
        }
    }
}