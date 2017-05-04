package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserProperties

class JooqUserRepository : JooqRepository(), UserRepository
{
    override fun getUserByEmail(email: String): User? {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveEmailMatch(email))
        if (user != null)
        {
            val permissions = dsl.select(PERMISSION.NAME)
                    .select(ROLE.SCOPE_PREFIX)
                    .select(USER_ROLE.SCOPE_ID)
                    .fromJoinPath(APP_USER, USER_ROLE, ROLE, ROLE_PERMISSION, PERMISSION)
                    .where(caseInsensitiveEmailMatch(email))
                    .fetch()
                    .map(this::mapPermission)
            return User(user.mapUserProperties(), permissions)
        }
        else
        {
            return null
        }
    }

    private fun caseInsensitiveEmailMatch(email: String)
            = APP_USER.EMAIL.lower().eq(email.toLowerCase())

    fun AppUserRecord.mapUserProperties() = UserProperties(
            this.username,
            this.name,
            this.email,
            this.passwordHash,
            this.salt,
            this.lastLoggedIn
    )

    fun mapPermission(record: Record): ReifiedPermission
    {
        val name = record[PERMISSION.NAME]
        val scopePrefix = record[ROLE.SCOPE_PREFIX]
        val scopeId = record[USER_ROLE.SCOPE_ID]
        if (scopePrefix != null)
        {
            return ReifiedPermission(name, Scope.Specific(scopePrefix, scopeId))
        }
        else
        {
            return ReifiedPermission(name, Scope.Global())
        }
    }
}