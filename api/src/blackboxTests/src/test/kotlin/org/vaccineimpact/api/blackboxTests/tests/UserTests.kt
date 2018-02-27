package org.vaccineimpact.api.blackboxTests.tests

import com.beust.klaxon.json
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.TestUserHelper
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.blackboxTests.schemas.JSONSchema
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addGroup
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.db.direct.addUserWithRoles
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.security.createRole
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class UserTests : DatabaseTest()
{
    @Test
    fun `can get user by username`()
    {
        validate("/users/testuser") against "User" given {
            it.addUserWithRoles("testuser",
                    ReifiedRole("member", Scope.Specific("modelling-group", "group")),
                    ReifiedRole("user", Scope.Global()))
        } requiringPermissions {
            PermissionSet("*/users.read")
        } andCheck {
            val expected = json {
                obj(
                        "username" to "testuser",
                        "name" to "Test User",
                        "email" to "testuser@example.com",
                        "last_logged_in" to null
                )
            }
            Assertions.assertThat(it).isEqualTo(expected)
        }
    }

    @Test
    fun `can get roles`()
    {
        val userHelper = TestUserHelper()

        JooqContext().use {
            userHelper.setupTestUser(it)
        }

        val requestHelper = RequestHelper()
        val response = requestHelper.get("/users/roles/all/",
                PermissionSet("*/can-login", "*/roles.read"), acceptsContentType = "application/json")

        Assertions.assertThat(response.statusCode).isEqualTo(200)
    }

    @Test
    fun `can add user role`()
    {
        validate("/users/testuser/actions/associate-role/", HttpMethod.post) given {
            it.addUserForTesting("testuser")
            it.addGroup("IC-Garske")
        } withPermissions {
            PermissionSet(setOf(ReifiedPermission("roles.write", Scope.parse("modelling-group:IC-Garske"))))
        } sendingJSON {
            json {
                obj("action" to "add",
                        "name" to "uploader",
                        "scope_prefix" to "modelling-group",
                        "scope_id" to "IC-Garske")
            }
        } withRequestSchema "AssociateRole" andCheckString {
            Assertions.assertThat(it).isEqualTo("OK")
        }
    }

    @Test
    fun `can remove user role`()
    {
        validate("/users/testuser/actions/associate-role/", HttpMethod.post) given {
            it.addUserForTesting("testuser")
            it.addGroup("IC-Garske")
        } withPermissions {
            PermissionSet(setOf(ReifiedPermission("roles.write", Scope.parse("modelling-group:IC-Garske"))))
        } sendingJSON {
            json {
                obj("action" to "remove",
                        "name" to "uploader",
                        "scope_prefix" to "modelling-group",
                        "scope_id" to "IC-Garske")
            }
        } withRequestSchema "AssociateRole" andCheckString {
            Assertions.assertThat(it).isEqualTo("OK")
        }
    }

    @Test
    fun `can remove global user role`()
    {
        validate("/users/testuser/actions/associate-role/", HttpMethod.post) given {
            it.addUserWithRoles("testuser", ReifiedRole("user", Scope.Global()))
            it.addGroup("IC-Garske")
        } withPermissions {
            PermissionSet(setOf(ReifiedPermission("roles.write", Scope.Global())))
        } sendingJSON {
            json {
                obj("action" to "remove",
                        "name" to "user",
                        "scope_prefix" to null,
                        "scope_id" to null)
            }
        } withRequestSchema "AssociateRole" andCheckString {
            Assertions.assertThat(it).isEqualTo("OK")
        }
    }

    @Test
    fun `returns user with all roles if logged in user has global scope role read perm`()
    {
        validate("/users/testuser") against "User" given {
            it.addUserWithRoles("testuser",
                    ReifiedRole("member", Scope.Specific("modelling-group", "group")),
                    ReifiedRole("member", Scope.Specific("modelling-group", "group2")),
                    ReifiedRole("touchstone-preparer", Scope.Global()))
        } withPermissions {
            PermissionSet("*/users.read", "*/roles.read")
        } andCheck {

            Assertions.assertThat(it).isEqualTo(json {
                obj(
                        "username" to "testuser",
                        "name" to "Test User",
                        "email" to "testuser@example.com",
                        "last_logged_in" to null,
                        "roles" to array(
                                obj(
                                        "name" to "touchstone-preparer",
                                        "scope_id" to "",
                                        "scope_prefix" to null),
                                obj(
                                        "name" to "member",
                                        "scope_id" to "group",
                                        "scope_prefix" to "modelling-group"),
                                obj(
                                        "name" to "member",
                                        "scope_id" to "group2",
                                        "scope_prefix" to "modelling-group"))
                )
            })
        }
    }

    @Test
    fun `returns user with scoped roles if logged in user has specific scope role read perm`()
    {
        validate("/users/someotheruser") against "User" given {

            it.createRole("test", "fake", "test role")

            it.addUserWithRoles("someotheruser",
                    ReifiedRole("member", Scope.Specific("modelling-group", "group")),
                    ReifiedRole("member", Scope.Specific("modelling-group", "group2")),
                    ReifiedRole("test", Scope.Specific("fake", "group")),
                    ReifiedRole("touchstone-preparer", Scope.Global()))

        } withPermissions {
            PermissionSet("*/users.read", "modelling-group:group/roles.read")
        } andCheck {

            Assertions.assertThat(it).isEqualTo(json {
                obj(
                        "username" to "someotheruser",
                        "name" to "Test User",
                        "email" to "someotheruser@example.com",
                        "last_logged_in" to null,
                        "roles" to array(
                                obj(
                                        "name" to "member",
                                        "scope_id" to "group",
                                        "scope_prefix" to "modelling-group"))
                )
            })
        }
    }

    @Test
    fun `returns 404 and descriptive error code if username does not exist`()
    {
        val requestHelper = RequestHelper()
        val userHelper = TestUserHelper()

        JooqContext().use {
            userHelper.setupTestUser(it)
        }

        val response = requestHelper.get("/users/nonexistentuser", PermissionSet("*/can-login", "*/users.read"), acceptsContentType = "application/json")
        JSONSchema("User").validator.validateError(response.text, "unknown-username")
        Assertions.assertThat(response.statusCode).isEqualTo(404)
    }

    @Test
    fun `can get all users`()
    {
        validate("/users/") against "Users" given {
            it.addUserWithRoles("testuser1",
                    ReifiedRole("member", Scope.Specific("modelling-group", "group")),
                    ReifiedRole("user", Scope.Global()))
            it.addUserWithRoles("testuser2",
                    ReifiedRole("user", Scope.Global()))
        } requiringPermissions {
            PermissionSet("*/users.read")
        } andCheckArray {

            // the above 2 users plus standard test user
            Assertions.assertThat(it.size).isEqualTo(3)

            Assertions.assertThat(it).contains(json {
                obj(
                        "username" to "testuser1",
                        "name" to "Test User",
                        "email" to "testuser1@example.com",
                        "last_logged_in" to null
                )
            })

            Assertions.assertThat(it).contains(json {
                obj(
                        "username" to "testuser2",
                        "name" to "Test User",
                        "email" to "testuser2@example.com",
                        "last_logged_in" to null)
            })

        }
    }

}
