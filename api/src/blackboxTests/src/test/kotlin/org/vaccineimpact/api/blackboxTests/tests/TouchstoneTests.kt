package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addTouchstone
import org.vaccineimpact.api.db.direct.addTouchstoneVersion
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class TouchstoneTests : DatabaseTest()
{
    private fun JooqContext.setupTouchstones()
    {
        addTouchstone("touchstone", "touchstone-description", comment = "comment")
        addTouchstoneVersion("touchstone", 1, "description-1", "open")
        addTouchstoneVersion("touchstone", 2, "description-2", "in-preparation")
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
                                "id" to "touchstone",
                                "description" to "touchstone-description",
                                "comment" to "comment",
                                "versions" to array(
                                        obj(
                                                "id" to "touchstone-1",
                                                "name" to "touchstone",
                                                "version" to 1,
                                                "status" to "open",
                                                "description" to "description-1"
                                        )
                                )
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
            assertThat(it).isEqualTo(json {
                array(
                        obj(
                                "id" to "touchstone",
                                "description" to "touchstone-description",
                                "comment" to "comment",
                                "versions" to array(
                                        obj(
                                                "id" to "touchstone-2",
                                                "name" to "touchstone",
                                                "version" to 2,
                                                "status" to "in-preparation",
                                                "description" to "description-2"
                                        ),
                                        obj(
                                                "id" to "touchstone-1",
                                                "name" to "touchstone",
                                                "version" to 1,
                                                "status" to "open",
                                                "description" to "description-1"
                                        )
                                )
                        )
                )
            })
        }
    }
}
