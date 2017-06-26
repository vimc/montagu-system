package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.permissions.RoleAssignment
import org.vaccineimpact.api.security.MontaguUser
import org.vaccineimpact.api.security.UserProperties

class JooqUserRepository : JooqRepository(), UserRepository
{
    override fun getMontaguUserByEmail(email: String): MontaguUser?
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

            return MontaguUser(
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

    override fun getUserByUsername(username: String): User
    {
        val user = getUser(username)

        return User(
                user.username,
                user.name,
                user.email,
                user.lastLoggedIn,
                null)

    }

    override fun getRolesForUser(username: String): List<RoleAssignment>
    {
        return dsl.select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                .select(USER_ROLE.SCOPE_ID)
                .fromJoinPath(APP_USER, USER_ROLE, ROLE)
                .where(caseInsensitiveUsernameMatch(username))
                .fetch()
                .map(this::mapRoleAssignment)
                .distinct()
    }

    override fun all(): Iterable<User>
    {
        return dsl.select(APP_USER.USERNAME, APP_USER.NAME, APP_USER.EMAIL, APP_USER.LAST_LOGGED_IN)
                .from(APP_USER)
                .fetchInto(User::class.java)
    }

    override fun alltest(): List<User>
    {
        return dsl.select()
                .from(APP_USER)
                .leftJoin(USER_ROLE)
                .on(APP_USER.USERNAME.eq(USER_ROLE.USERNAME))
                .leftJoin(ROLE)
                .on(ROLE.ID.eq(USER_ROLE.ROLE))
                .fetchGroups(APP_USER)
                .map(this::mapUserWithRoles)
    }

    private fun mapUserWithRoles(entry: Map.Entry<AppUserRecord, org.jooq.Result<Record>>): User
    {
        val user = entry.key.into(User::class.java)
        var roles = entry.value.map{
            r-> r.into(RoleAssignment::class.java)
        }

        //user.roles = roles

        return user
    }

    override fun allWithRoles(): Iterable<User>
    {
        return dsl.select(APP_USER.USERNAME, APP_USER.NAME,
                    APP_USER.EMAIL, APP_USER.LAST_LOGGED_IN)
                .select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                .select(USER_ROLE.SCOPE_ID)
                .fromJoinPath(APP_USER, USER_ROLE, ROLE)
                .fetchInto(User::class.java)
    }

    private fun getUser(username: String): AppUserRecord
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveUsernameMatch(username))

        if (user == null)
            throw UnknownObjectError(username, "Username")

        return user
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

    fun mapRoleAssignment(record: Record): RoleAssignment
    {
        var scopeId = record[USER_ROLE.SCOPE_ID]

        // set scopeId to null if USER_ROLE.SCOPE_ID is an empty string,
        // so that scopeId and scopePrefix are consistently null/not null
        scopeId = if (scopeId.isEmpty())
        {
            null
        }
        else
        {
            scopeId
        }

        return RoleAssignment(
                record[ROLE.NAME],
                record[ROLE.SCOPE_PREFIX],
                scopeId)
    }

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