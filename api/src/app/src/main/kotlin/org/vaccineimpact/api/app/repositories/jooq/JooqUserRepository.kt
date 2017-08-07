package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Record
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.JooqContext
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
import java.sql.Timestamp

class JooqUserRepository(db: JooqContext) : JooqRepository(db), UserRepository
{
    override fun updateLastLoggedIn(username: String)
    {
        dsl.update(APP_USER)
                .set(APP_USER.LAST_LOGGED_IN, Timestamp(System.currentTimeMillis()))
                .execute()

    }

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
                    user.into(UserProperties::class.java),
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
        return getUser(username).into(User::class.java)
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

    override fun allWithRoles(): List<User>
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

    override fun addUser(user: CreateUser)
    {
        dsl.newRecord(APP_USER).apply {
            username = user.username
            name = user.name
            email = user.email
        }.insert()
    }

    private fun mapUserWithRoles(entry: Map.Entry<AppUserRecord, org.jooq.Result<Record>>): User
    {
        val user = entry.key.into(User::class.java)
        val roles = entry.value.filter{ r-> r[USER_ROLE.ROLE] != null }
                .map(this::mapRoleAssignment)

        return user.copy(roles = roles)
    }

    private fun getUser(username: String): AppUserRecord
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveUsernameMatch(username))
                ?: throw UnknownObjectError(username, "Username")

        return user
    }

    private fun caseInsensitiveEmailMatch(email: String)
            = APP_USER.EMAIL.lower().eq(email.toLowerCase())

    private fun caseInsensitiveUsernameMatch(username: String)
            = APP_USER.USERNAME.lower().eq(username.toLowerCase())

    private fun mapPermission(record: Record) = ReifiedPermission(record[PERMISSION.NAME], mapScope(record))

    private fun mapRole(record: Record) = ReifiedRole(record[ROLE.NAME], mapScope(record))

    private fun mapRoleAssignment(record: Record): RoleAssignment
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

    private fun mapScope(record: Record): Scope
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