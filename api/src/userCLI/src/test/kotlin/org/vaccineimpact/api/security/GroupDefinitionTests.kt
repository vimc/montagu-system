package org.vaccineimpact.api.security

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.test_helpers.DatabaseTest

class GroupDefinitionTests : DatabaseTest()
{
    @Test
    fun `GroupList getGroups just returns list`()
    {
        val def = GroupDefinition.GroupList(listOf("a", "b"))
        val groups = def.getGroups(mock<JooqContext>())
        assertThat(groups).isEqualTo(listOf("a", "b"))
    }

    @Test
    fun `AllGroups returns all current groups in database`()
    {
        val def = GroupDefinition.AllGroups()
        val groups = JooqContext().use { db ->
            db.addGroup("a", "A")
            db.addGroup("b2", "B")
            db.addGroup("b1", "B", current = "b2")
            def.getGroups(db)
        }
        assertThat(groups).isEqualTo(listOf("a", "b2"))
    }
}