package org.vaccineimpact.api.app.app_start

import org.vaccineimpact.api.models.Compressed
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.security.*
import java.time.Duration

class RootTokenGenerator(val helper: WebTokenHelper = WebTokenHelper(KeyHelper.loadKeyPair()))
{
    fun generate(permissions: List<String>): Compressed
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
        val token = helper.generateToken(dummyUser, Duration.ofDays(365))
        return token.deflated()
    }
}
