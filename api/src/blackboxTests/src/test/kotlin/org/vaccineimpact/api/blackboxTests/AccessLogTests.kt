package org.vaccineimpact.api.blackboxTests

import org.assertj.core.api.Assertions.assertThat
import org.bouncycastle.util.IPAddress
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.API_ACCESS_LOG
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.security.UserHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest
import java.beans.ConstructorProperties
import java.sql.Timestamp
import java.time.Instant

class AccessLogTests : DatabaseTest()
{
    @Test
    fun `logs failed login attempt`()
    {
        doThisAndCheck(null, "/authenticate/", 401) {
            AuthenticationTests.post("", "", includeAuth = false)
        }
    }

    @Test
    fun `logs successful login attempt`()
    {
        JooqContext().use {
            UserHelper.saveUser(it.dsl, "joe.bloggs", "Full Name", "email@example.com", "password")
        }
        doThisAndCheck("joe.bloggs", "/authenticate/", 200) {
            AuthenticationTests.post("email@example.com", "password")
        }
    }

    @Test
    fun `logs ordinary request`()
    {
        val token = TestUserHelper.setupTestUserAndGetToken(PermissionSet("*/can-login"))
        val helper = RequestHelper()
        doThisAndCheck("test.user", "/diseases/", 200) {
            helper.get("/diseases/", token)
        }
    }

    @Test
    fun `logs ordinary request without token`()
    {
        val helper = RequestHelper()
        doThisAndCheck(null, "/diseases/", 401) {
            helper.get("/diseases/")
        }
    }

    @Test
    fun `logs ordinary request without permissions`()
    {
        val token = TestUserHelper.setupTestUserAndGetToken(PermissionSet())
        val helper = RequestHelper()
        doThisAndCheck("test.user", "/diseases/", 403) {
            helper.get("/diseases/", token)
        }
    }

    private fun doThisAndCheck(who: String?, what: String, result: Int?, action: () -> Unit)
    {
        val before = Instant.now()
        action()
        val entry = JooqContext().use { db ->
            db.dsl.select(API_ACCESS_LOG.fieldsAsList())
                    .from(API_ACCESS_LOG)
                    .orderBy(API_ACCESS_LOG.WHEN.desc())
                    .fetchInto(Entry::class.java)
                    .first()
        }
        assertThat(entry.who).`as`("Who").isEqualTo(who)

        val timestamp = entry.`when`.toInstant()
        assertThat(timestamp).isGreaterThanOrEqualTo(before)
        assertThat(timestamp).isLessThanOrEqualTo(Instant.now())

        assertThat(entry.what).`as`("What").isEqualTo("/v1" + what)
        assertThat(entry.result).`as`("Result").isEqualTo(result)
        assertThat(IPAddress.isValid(entry.ipAddress)).`as`("IP Address is valid").isTrue()
    }

    data class Entry
    @ConstructorProperties("who", "timestamp", "what", "result", "ipAddress")
    constructor(val who: String?, val timestamp: Timestamp, val what: String, val result: Int?, val ipAddress: String?)
}