package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import com.github.fge.jackson.JsonLoader
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper.Companion.setupTestUser
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.validateSchema.JSONValidator
import spark.route.HttpMethod

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
            assertThat(it).isEqualTo(json {
                array(
                        obj("id" to "a", "description" to "description a"),
                        obj("id" to "b", "description" to "description b")
                )
            })
        }
    }

    @Test
    fun `can get modelling group memberships for user`()
    {
        JooqContext().use {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")
            it.addGroup("c", "description c")

            setupTestUser()
        }

        val permissions = PermissionSet(
                "*/can-login"
        )
        val roles = setOf(
                ReifiedRole("member", Scope.Specific("modelling-group", "a")),
                ReifiedRole("member", Scope.Specific("modelling-group", "b"))
        )

        val token = TestUserHelper().getTokenForTestUser(permissions, roles=roles)
        val response = RequestHelper().get("/modelling-groups/user/memberships/", token)

        val validator = JSONValidator()
        validator.validateSuccess(response.text)
        val groups  = JsonLoader.fromString(response.text)["data"]
        assertThat(groups.isArray).isTrue()
        assertThat((groups.count())).isEqualTo(2)

        assertThat(groups[0]["id"].textValue()).isEqualTo("a")
        assertThat(groups[0]["description"].textValue()).isEqualTo("description a")

        assertThat(groups[1]["id"].textValue()).isEqualTo("b")
        assertThat(groups[1]["description"].textValue()).isEqualTo("description b")
    }

    @Test
    fun `can get empty modelling group memberships for user with no member roles`()
    {
        JooqContext().use {
            it.addGroup("a", "description a")
            it.addGroup("b", "description b")

            setupTestUser()
        }

        val permissions = PermissionSet(
                "*/can-login"
        )

        val token = TestUserHelper().getTokenForTestUser(permissions)
        val response = RequestHelper().get("/modelling-groups/user/memberships/", token)

        val validator = JSONValidator()
        validator.validateSuccess(response.text)
        val groups  = JsonLoader.fromString(response.text)["data"]
        assertThat(groups.isArray).isTrue()
        assertThat((groups.count())).isEqualTo(0)
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
            assertThat(it).isEqualTo(json {
                obj(
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
                        "members" to array("group.member")
                )
            })
        }
    }

    @Test
    fun `can modify membership`()
    {
        validate("/modelling-groups/IC-Garske/actions/associate-member/", HttpMethod.post) given {
            it.addUserWithRoles("testuser", ReifiedRole("user", Scope.Global()))
            it.addGroup("IC-Garske")
        } withPermissions {
            PermissionSet(setOf(ReifiedPermission("modelling-groups.manage-members", Scope.Global())))
        } sendingJSON {
            json {
                obj("action" to "add",
                        "username" to "testuser")
            }
        } withRequestSchema "AssociateUser" andCheckString {
            Assertions.assertThat(it).isEqualTo("OK")
        }
    }

    private val writePermissions = PermissionSet(setOf(ReifiedPermission("modelling-groups.write", Scope.Global())))

    @Test
    fun `can create group`()
    {
        validate("/modelling-groups/", HttpMethod.post) requiringPermissions {
            writePermissions
        } sendingJSON {
            json {
                obj("id" to "IC-Garske",
                        "description" to "description",
                        "institution" to "Imperial",
                        "pi" to "Tini garske")
            }
        } withRequestSchema "ModellingGroupCreation" andCheckObjectCreation "/modelling-group/IC-Garske/"
    }
}