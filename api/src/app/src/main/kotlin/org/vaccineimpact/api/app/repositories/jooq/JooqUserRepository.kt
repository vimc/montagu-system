package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.ReifiedRole
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.UserProperties
import org.vaccineimpact.api.models.permissions.ReifiedPermission

class JooqUserRepository : JooqRepository(), UserRepository
{
    override fun getUserByEmail(email: String): User? {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveEmailMatch(email))
        if (user != null)
        {
            val records = dsl.select(PERMISSION.NAME)
                    .select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                    .select(USER_ROLE.SCOPE_ID)
                    .fromJoinPath(APP_USER, USER_ROLE, ROLE, ROLE_PERMISSION, PERMISSION)
                    .where(caseInsensitiveEmailMatch(email))
                    .fetch()
            return User(
                    user.mapUserProperties(),
                    records.map(this::mapRole).distinct(),
                    records.map(this::mapPermission)
            )
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

    fun mapPermission(record: Record) = ReifiedPermission(record[PERMISSION.NAME], mapScope(record))
    fun mapRole(record: Record) = ReifiedRole(record[ROLE.NAME], mapScope(record))

    fun mapScope(record: Record): Scope
    {
        val scopePrefix = record[ROLE.SCOPE_PREFIX]
        val scopeId = record[USER_ROLE.SCOPE_ID]
        if (scopePrefix != null)
        {
            return Scope.Specific(scopePrefix, scopeId)
        }
        else
        {
            return Scope.Global()
        }
    }
}