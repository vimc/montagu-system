package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addTouchstone
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class TouchstoneTests : DatabaseTest()
{
    private fun JooqContext.setupTouchstones()
    {
        addTouchstone("open", 6, "description-1", "open", addName = true, addStatus = true)
        addTouchstone("prep", 1, "description-2", "in-preparation", addName = true, addStatus = true)
    }

    @Test
    fun `can get touchstones`()
    {
        validate("/touchstones/") against "Touchstones" given {
            it.setupTouchstones()
        } requiringPermissions {
            PermissionSet("*/touchstones.read")
        } andCheckArray {
            assertThat(it).isEqualTo(json {
                array(
                        obj(
                                "id" to "open-6",
                                "name" to "open",
                                "version" to 6,
                                "status" to "open",
                                "description" to "description-1"
                        )
                )
            })
        }
    }

    @Test
    fun `only touchstone preparer can see in-preparation touchstones`()
    {
        validate("/touchstones/") against "Touchstones" given {
            it.setupTouchstones()
        } withPermissions {
            PermissionSet("*/touchstones.read", "*/touchstones.prepare")
        } andCheckArray {
            assertThat(it.size).isEqualTo(2)
            assertThat(it).contains(json {
                obj(
                        "id" to "open-6",
                        "name" to "open",
                        "version" to 6,
                        "status" to "open",
                        "description" to "description-1"
                )
            })
            assertThat(it).contains(json {
                obj(
                        "id" to "prep-1",
                        "name" to "prep",
                        "version" to 1,
                        "status" to "in-preparation",
                        "description" to "description-2"
                )
            })
        }
    }
}
