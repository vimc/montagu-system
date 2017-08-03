package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.JsonObject
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.blackboxTests.helpers.montaguData
import org.vaccineimpact.api.blackboxTests.helpers.toJsonObject
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class CreateUserTests : DatabaseTest()
{
    @Test
    fun `can create user`()
    {
        val objectUrl = "/users/gandalf/"
        val postData = mapOf(
                "username" to "gandalf",
                "name" to "Gandalf the Grey",
                "email" to "gandalf@example.com"
        )

        validate("/users/", HttpMethod.post) against "CreateUser" sending {
            postData.toJsonObject()
        } requiringPermissions {
            PermissionSet("*/users.create")
        } andCheckObjectCreation objectUrl

        val permissions = PermissionSet("*/users.read", "*/can-login")
        val user = RequestHelper().get(objectUrl, permissions).montaguData<JsonObject>()
        assertThat(user).isEqualTo((postData + mapOf("last_logged_in" to null)).toJsonObject())
    }
}