package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JsonObject
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.*
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class CreateUserTests : DatabaseTest()
{
    val creationPermissions = PermissionSet("*/can-login", "*/users.create")
    val postData = mapOf(
            "username" to "gandalf",
            "name" to "Gandalf the Grey",
            "email" to "gandalf@example.com"
    )

    @Test
    fun `can create user`()
    {
        val objectUrl = "/users/gandalf/"

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
        assertCannotCreateDuplicate("username" to "gandalf", "duplicate-key:username")
    }

    @Test
    fun `cannot create two users with the same email`()
    {
        assertCannotCreateDuplicate("email" to "gandalf@example.com", "duplicate-key:email")
    }

    fun assertCannotCreateDuplicate(sharedProperty: Pair<String, *>, expectedErrorCode: String)
    {
        val token = TestUserHelper.setupTestUserAndGetToken(creationPermissions)
        val requestHelper = RequestHelper()
        val r1 = requestHelper.post("/users/", token = token, data = postData.toJsonObject())
        assertThat(r1.statusCode).isEqualTo(201)

        val differentData = mapOf(
                "username" to "different-username",
                "name" to "different name",
                "email" to "different@example.com"
        )
        val clashingData = differentData + mapOf(sharedProperty)
        val r2 = requestHelper.post("/users/", token = token, data = clashingData.toJsonObject())
        assertThat(r2.statusCode).isEqualTo(409)
        assertThat(r2.montaguErrors().map { it.code }).contains(expectedErrorCode)
    }
}