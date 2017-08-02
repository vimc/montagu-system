package org.vaccineimpact.api.blackboxTests

import com.beust.klaxon.json
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest
import spark.route.HttpMethod

class CreateUserTests : DatabaseTest()
{
    @Test
    fun `can create user`()
    {
        validate("/users/", HttpMethod.post) against "CreateUser" sending json {
            obj(
                    "username" to "gandalf",
                    "name" to "Gandalf the Grey",
                    "email" to "gandalf@example.com"
            )
        } given {} requiringPermissions {
            PermissionSet("*/users.create")
        } andCheckObjectCreation "/users/gandalf/"
    }
}