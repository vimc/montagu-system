package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.Rule
import org.vaccineimpact.api.models.helpers.SerializationRule
import org.vaccineimpact.api.models.permissions.RoleAssignment
import java.beans.ConstructorProperties
import java.time.Instant

data class User(
        val username: String,
        val name: String,
        val email: String,
        val lastLoggedIn: Instant?,
        @SerializationRule(Rule.EXCLUDE_IF_NULL) val roles: List<RoleAssignment>?
)
{
    // Exists to make it easier to map with jOOQ
    @ConstructorProperties("username", "name", "email", "lastLoggedIn")
    constructor(username: String, name: String, email: String, lastLoggedIn: Instant?)
        : this(username, name, email, lastLoggedIn, roles = null)
}
