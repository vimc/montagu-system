package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JsonObject
import com.beust.klaxon.json
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.blackboxTests.validators.JSONValidator
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class CreateUserTests : DatabaseTest()
{
    val requestHelper = RequestHelper()
    val validator = JSONValidator()
    val creationPermissions = PermissionSet("*/can-login", "*/users.create")
    val postData = mapOf(
            "username" to "gandalf.grey",
            "name" to "Gandalf the Grey",
            "email" to "gandalf@example.com"
    )

    @Test
    fun `can create user`()
    {
        val objectUrl = "/users/gandalf.grey/"

        validate("/users/", HttpMethod.post) against "CreateUser" sending {
            postData.toJsonObject()
        } requiringPermissions {
            creationPermissions
        } andCheckObjectCreation objectUrl

        val permissions = PermissionSet("*/users.read", "*/can-login")
        val user = RequestHelper().get(objectUrl, permissions).montaguData<JsonObject>()
        assertThat(user).isEqualTo((postData + mapOf("last_logged_in" to null)).toJsonObject())
    }

    @Test
    fun `cannot create two users with the same username`()
    {
        assertCannotCreateDuplicate("username" to "gandalf.grey", "duplicate-key:username")
    }

    @Test
    fun `cannot create two users with the same email`()
    {
        assertCannotCreateDuplicate("email" to "gandalf@example.com", "duplicate-key:email")
    }

    @Test
    fun `throws error if required field is missing`()
    {
        TestUserHelper.setupTestUser()
        val response = requestHelper.post("/users", creationPermissions, json {
            obj(
                    "username" to "bob",
                    "name" to "Robert Smith"
            )
        })
        assertThat(response.statusCode).isEqualTo(400)
        validator.validateError(response.text, "invalid-field:email:missing")
    }

    @Test
    fun `throws error if required field is blank`()
    {
        TestUserHelper.setupTestUser()
        val response = requestHelper.post("/users", creationPermissions, json {
            obj(
                    "username" to "bob",
                    "name" to " ",
                    "email" to "email@example.com"
            )
        })
        assertThat(response.statusCode).isEqualTo(400)
        validator.validateError(response.text, "invalid-field:name:blank")
    }

    @Test
    fun `throws error if username is invalid`()
    {
        TestUserHelper.setupTestUser()
        val response = requestHelper.post("/users", creationPermissions, json {
            obj(
                    "username" to "^&*",
                    "name" to "name",
                    "email" to "email@example.com"
            )
        })
        assertThat(response.statusCode).isEqualTo(400)
        validator.validateError(response.text, "invalid-field:username:bad-format")
    }

    @Test
    fun `throws error if email is invalid`()
    {
        TestUserHelper.setupTestUser()
        val response = requestHelper.post("/users", creationPermissions, json {
            obj(
                    "username" to "a.b.c",
                    "name" to "john@example.com",
                    "email" to "John Smith"
            )
        })
        assertThat(response.statusCode).isEqualTo(400)
        validator.validateError(response.text, "invalid-field:email:bad-format")
    }

    fun assertCannotCreateDuplicate(sharedProperty: Pair<String, *>, expectedErrorCode: String)
    {
        val token = TestUserHelper.setupTestUserAndGetToken(creationPermissions)
        val r1 = requestHelper.post("/users/", token = token, data = postData.toJsonObject())
        assertThat(r1.statusCode).isEqualTo(201)

        val differentData = mapOf(
                "username" to "different.username",
                "name" to "different name",
                "email" to "different@example.com"
        )
        val clashingData = differentData + mapOf(sharedProperty)
        val r2 = requestHelper.post("/users/", token = token, data = clashingData.toJsonObject())
        assertThat(r2.statusCode).isEqualTo(409)
        validator.validateError(r2.text, expectedErrorCode)
    }
}