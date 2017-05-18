package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.models.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class ModellingGroupTests : DatabaseTest()
{
    @Test
    fun `getModellingGroups matches schema`()
    {
        validate("/modelling-groups/") against "ModellingGroups" given {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
        } requiringPermissions {
            PermissionSet("*/modelling-groups.read")
        } andCheckArray {
            assertThat(it).isEqualTo(json { array(
                    obj("id" to "a", "description" to "description a"),
                    obj("id" to "b", "description" to "description b")
            )})
        }
    }
}