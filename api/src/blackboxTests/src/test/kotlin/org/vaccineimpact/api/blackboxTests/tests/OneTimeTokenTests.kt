package org.vaccineimpact.api.blackboxTests.tests

import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.validate
import org.vaccineimpact.api.models.permissions.PermissionSet
import org.vaccineimpact.api.test_helpers.DatabaseTest

class OneTimeTokenTests : DatabaseTest()
{
    @Test
    fun `can get new style onetime token`()
    {
        validate("/onetime_token/?url=http://localhost/test") against "Token" given {
        } requiringPermissions {
            PermissionSet("*/can-login")
        }
    }
}
