package org.vaccineimpact.api.security

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.test_helpers.DatabaseTest

class AddUserToGroupTests : DatabaseTest()
{
    @Test
    fun `can give groups to user`()
    {
        val options = AddUserToGroupOptions("username", Groups.GroupList(listOf("group1", "group2")))
        JooqContext().use { db ->
            db.addUserForTesting("username")
            db.addGroup("group1")
            db.addGroup("group2")
            options.run()
            val groups = db.dsl.select(USER_ROLE.SCOPE_ID)
                    .fromJoinPath(APP_USER, USER_ROLE, ROLE)
                    .where(APP_USER.USERNAME.eq("username"))
                    .and(ROLE.NAME.eq("member"))
                    .and(ROLE.SCOPE_PREFIX.eq("modelling-group"))
                    .fetch()
                    .map { it[USER_ROLE.SCOPE_ID] }
                    .toSet()
            assertThat(groups).isEqualTo(setOf("group1", "group2"))
        }
    }
}