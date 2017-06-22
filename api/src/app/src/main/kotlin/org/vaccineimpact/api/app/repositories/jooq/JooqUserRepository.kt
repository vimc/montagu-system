package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.*

import org.vaccineimpact.api.security.UserProperties

class JooqUserRepository : JooqRepository(), UserRepository
{
    override fun getUserByEmail(email: String): org.vaccineimpact.api.security.MontaguUser?
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveEmailMatch(email))
        if (user != null)
        {
            val records = dsl.select(PERMISSION.NAME)
                    .select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                    .select(USER_ROLE.SCOPE_ID)
                    .fromJoinPath(APP_USER, USER_ROLE, ROLE, ROLE_PERMISSION, PERMISSION)
                    .where(caseInsensitiveEmailMatch(email))
                    .fetch()

            return org.vaccineimpact.api.security.MontaguUser(
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

    override fun getUserByUsername(username: String): org.vaccineimpact.api.models.User?
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveUsernameMatch(username))
        if (user != null)
        {

            return User(
                    user.username,
                    user.name,
                    user.email,
                    user.lastLoggedIn
            )
        }
        else
        {
            return null
        }
    }

    override fun getUserByUsernameWithRoles(username: String): UserWithRoles?
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveUsernameMatch(username))
        if (user != null)
        {
            val records = dsl.select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                    .select(USER_ROLE.SCOPE_ID)
                    .fromJoinPath(APP_USER, USER_ROLE, ROLE)
                    .where(caseInsensitiveUsernameMatch(username))
                    .fetch()

            return UserWithRoles(
                    user.username,
                    user.name,
                    user.email,
                    user.lastLoggedIn,
                    records.map(this::mapRoleAssignment).distinct()
            )
        }
        else
        {
            return null
        }
    }

    private fun caseInsensitiveEmailMatch(email: String)
            = APP_USER.EMAIL.lower().eq(email.toLowerCase())

    private fun caseInsensitiveUsernameMatch(username: String)
            = APP_USER.USERNAME.lower().eq(username.toLowerCase())

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

    fun mapRoleAssignment(record: Record) = RoleAssignment(
            record[ROLE.NAME],
            record[USER_ROLE.SCOPE_ID],
            record[ROLE.SCOPE_PREFIX])

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