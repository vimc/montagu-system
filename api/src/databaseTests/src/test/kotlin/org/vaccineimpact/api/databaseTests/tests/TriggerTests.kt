package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.exception.DataAccessException
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.tables.records.BurdenEstimateRecord
import org.vaccineimpact.api.db.withoutCheckingForeignKeyConstraints
import org.vaccineimpact.api.test_helpers.DatabaseTest
import java.math.BigDecimal

class TriggerTests : DatabaseTest()
{
    @Test
    fun `can disable foreign key triggers`()
    {
        JooqContext().use { db ->
            assertThatThrownBy {
                makeRecord(db).insert()
            }.isInstanceOf(DataAccessException::class.java)

            db.dsl.withoutCheckingForeignKeyConstraints(BURDEN_ESTIMATE) {
                makeRecord(db).insert()
            }
        }
    }

    @Test
    fun `disabling foreign key triggers does not disable primary key constraints`()
    {
        JooqContext().use { db ->
            db.dsl.withoutCheckingForeignKeyConstraints(BURDEN_ESTIMATE) {
                makeRecord(db).insert()
                assertThatThrownBy {
                    makeRecord(db).insert()
                }.isInstanceOf(DataAccessException::class.java)
            }
        }
    }

    private fun makeRecord(db: JooqContext): BurdenEstimateRecord
    {
        val table = BURDEN_ESTIMATE
        return db.dsl.newRecord(table).apply {
            id = 1
            burdenEstimateSet = 0
            country = 1
            year = 2000
            age = 20
            burdenOutcome = 0
            value = BigDecimal.TEN
        }
    }
}