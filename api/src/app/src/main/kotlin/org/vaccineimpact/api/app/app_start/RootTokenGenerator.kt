package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.InternalUser
import org.vaccineimpact.api.security.KeyHelper
import org.vaccineimpact.api.security.UserProperties
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class RootTokenGenerator(val helper: WebTokenHelper = WebTokenHelper(KeyHelper.loadKeyPair()))
{
    fun generate(permissions: List<String>): String
    {
        val parsedPermissions = permissions.map { ReifiedPermission.parse(it) }
        val dummyUserProperties = UserProperties(
                "%dummy.user%",
                "Fake user for generating tokens",
                "montagu-help@imperial.ac.uk",
                null,
                null
        )
        val dummyUser = InternalUser(dummyUserProperties, emptyList(), parsedPermissions)
        return helper.generateToken(dummyUser, Duration.ofDays(365))
    }
}
