package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.db.direct.addDisease
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addModel
import org.vaccineimpact.api.db.direct.addUserWithRoles
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedRole
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

    @Test
    fun `getModellingGroup matches schema`()
    {
        validate("/modelling-groups/group/") against "ModellingGroupDetails" given {
            it.addGroup("group", "group description")
            it.addDisease("d1")
            it.addDisease("d2")
            it.addModel("a", "group", "d1", "description A", "citation A")
            it.addModel("b", "group", "d2", "description B", "citation B")
            it.addUserWithRoles("group.member", ReifiedRole("member", Scope.Specific("modelling-group", "group")))
        } requiringPermissions {
            PermissionSet("*/modelling-groups.read", "*/models.read")
        } andCheck {
            assertThat(it).isEqualTo(json { obj(
                    "id" to "group",
                    "description" to "group description",
                    "models" to array(
                            obj(
                                    "id" to "a",
                                    "modelling_group" to "group",
                                    "description" to "description A",
                                    "citation" to "citation A"
                            ),
                            obj(
                                    "id" to "b",
                                    "modelling_group" to "group",
                                    "description" to "description B",
                                    "citation" to "citation B"
                            )
                    ),
                    "members" to array("group.user")
            )})
        }
    }
}