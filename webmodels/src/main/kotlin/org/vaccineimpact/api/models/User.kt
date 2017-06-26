package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.permissions.RoleAssignment
import java.sql.Timestamp

data class User(
        val username: String,
        val name: String,
        val email: String,
        val lastLoggedIn: Timestamp?,
        val roles: List<RoleAssignment>?)
