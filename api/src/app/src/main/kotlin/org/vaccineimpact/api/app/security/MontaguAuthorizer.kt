package org.vaccineimpact.api.app.security

import org.pac4j.core.authorization.authorizer.RequireAllPermissionsAuthorizer
import org.pac4j.core.profile.CommonProfile

class MontaguAuthorizer(requiredPermissions: List<String>)
    : RequireAllPermissionsAuthorizer<CommonProfile>(requiredPermissions)