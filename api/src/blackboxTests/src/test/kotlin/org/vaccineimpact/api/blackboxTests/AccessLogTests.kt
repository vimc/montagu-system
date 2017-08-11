package org.vaccineimpact.api.blackboxTests

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.API_ACCESS_LOG
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.test_helpers.DatabaseTest
import java.beans.ConstructorProperties
import java.sql.Timestamp
import java.time.Instant

class AccessLogTests : DatabaseTest()
{
    @Test
    fun `logs failed login attempts`()
    {
        doThisAndCheck(null, "/authenticate/", 400) {
            AuthenticationTests.post("", "", includeAuth = false)
        }
    }

    private fun doThisAndCheck(who: String?, what: String, result: Int?, action: () -> Unit)
    {
        val before = Instant.now()
        action()
        val entry = JooqContext().use { db ->
            db.dsl.select(API_ACCESS_LOG.fieldsAsList())
                    .from(API_ACCESS_LOG)
                    .fetchInto(Entry::class.java)
                    .single()
        }
        assertThat(entry.who).`as`("Who").isEqualTo(who)

        val timestamp = entry.`when`.toInstant()
        assertThat(timestamp).isGreaterThanOrEqualTo(before)
        assertThat(timestamp).isLessThanOrEqualTo(Instant.now())

        assertThat(entry.what).`as`("What").isEqualTo(what)
        assertThat(entry.result).`as`("Result").isEqualTo(result)
    }

    data class Entry
    @ConstructorProperties("who", "when", "what", "result")
    constructor(val who: String?, val `when`: Timestamp, val what: String, val result: Int?)
}