package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.Result
import org.jooq.SelectOnConditionStep
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.CreateUser
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.AssociateUser
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.User
import org.vaccineimpact.api.models.permissions.AssociateRole
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.permissions.ReifiedRole
import org.vaccineimpact.api.models.permissions.RoleAssignment
import org.vaccineimpact.api.security.*
import java.sql.Timestamp
import java.time.Instant

class JooqUserRepository(dsl: DSLContext) : JooqRepository(dsl), UserRepository
{
    override fun modifyUserRole(username: String, associateRole: AssociateRole)
    {
        val role = ReifiedRole(associateRole.name,
                Scope.parse(associateRole))

        getUser(username)

        when (associateRole.action)
        {
            "add" -> ensureUserHasRole(username, role)
            "remove" -> removeRoleFromUser(username, role)
        }
    }

    override fun globalRoles(): List<String>
    {
        return dsl.select(ROLE.NAME)
                .from(ROLE)
                .where(ROLE.SCOPE_PREFIX.isNull)
                .fetchInto(String::class.java)
    }

    override fun reportReaders(reportName: String): List<User>
    {
        val reportReaders = dsl.select(APP_USER.USERNAME)
                .fromJoinPath(APP_USER, USER_GROUP_MEMBERSHIP, USER_GROUP, USER_GROUP_ROLE, ROLE)
                .where(USER_GROUP_ROLE.SCOPE_ID.eq(reportName))
                .or(ROLE.SCOPE_PREFIX.isNull)
                .and(ROLE.NAME.eq("reports-reader"))

        return this.allWithRolesQuery()
                .where(APP_USER.USERNAME.`in`(reportReaders))
                .fetchGroups(APP_USER)
                .map(this::mapUserWithRoles)
    }

    private fun removeRoleFromUser(username: String, role: ReifiedRole)
    {
        val roleId = dsl.getRole(role.name, role.scope.databaseScopePrefix)
                ?: throw UnknownRoleException(role.name, role.scope.databaseScopePrefix.toString())

        dsl.deleteFrom(USER_GROUP_ROLE)
                .where(USER_GROUP_ROLE.USER_GROUP.eq(username))
                .and(USER_GROUP_ROLE.ROLE.eq(roleId))
                .and(USER_GROUP_ROLE.SCOPE_ID.eq(role.scope.databaseScopeId))
                .execute()
    }

    private fun ensureUserHasRole(username: String, role: ReifiedRole)
    {
        val roleId = dsl.getRole(role.name, role.scope.databaseScopePrefix)
                ?: throw UnknownRoleException(role.name, role.scope.databaseScopePrefix.toString())

        if (role.scope.databaseScopePrefix == "modelling-group")
        {
            dsl.select(MODELLING_GROUP.ID)
                    .from(MODELLING_GROUP)
                    .where(MODELLING_GROUP.ID.eq(role.scope.databaseScopeId))
                    .fetch()
                    .singleOrNull()
                    ?: throw UnknownObjectError(role.scope.databaseScopeId, "modelling-group")
        }

        dsl.ensureUserHasRole(username, roleId, role.scope.databaseScopeId)
    }

    override fun updateLastLoggedIn(username: String)
    {
        dsl.update(APP_USER)
                .set(APP_USER.LAST_LOGGED_IN, Timestamp.from(Instant.now()))
                .where(APP_USER.USERNAME.eq(username))
                .execute()
    }

    override fun saveConfidentialityAgreement(username: String)
    {
        dsl.newRecord(CONFIDENTIALITY_AGREEMENT_SIGNATURE).apply {
            this.confidentialityAgreement = "rfp-applicants-04-18"
            this.username = username
        }.insert()
    }

    override fun getUserByEmail(email: String): InternalUser?
    {
        val user = dsl.fetchAny(APP_USER, caseInsensitiveEmailMatch(email))
        return if (user != null)
        {
            getUserByUsername(user.username)
        }
        else
        {
            null
        }
    }

    private fun getRolesAndPermissions(username: String): Result<Record>
    {
        return dsl.select(PERMISSION.NAME)
                .select(ROLE.NAME, ROLE.SCOPE_PREFIX)
                .select(USER_GROUP_ROLE.SCOPE_ID)
                .fromJoinPath(APP_USER,
                        USER_GROUP_MEMBERSHIP,
                        USER_GROUP,
                        USER_GROUP_ROLE,
                        ROLE)
                .leftJoin(ROLE_PERMISSION)
                .on(ROLE_PERMISSION.ROLE.eq(ROLE.ID))
                .leftJoin(PERMISSION)
                .on(ROLE_PERMISSION.PERMISSION.eq(PERMISSION.NAME))
                .where(caseInsensitiveUsernameMatch(username))
                .fetch()

    }

    override fun getUserByUsername(username: String): InternalUser
    {
        val user = getUser(username).into(UserProperties::class.java)
        val records = getRolesAndPermissions(username)
        return InternalUser(
                user,
                records.map(this::mapRole).distinct(),
                records.filter { it[PERMISSION.NAME] != null }.map(this::mapPermission)
        )
    }

    override fun all(): Iterable<User>
    {
        return dsl.select(APP_USER.USERNAME, APP_USER.NAME, APP_USER.EMAIL, APP_USER.LAST_LOGGED_IN)
                .from(APP_USER)
                .fetchInto(User::class.java)
    }

    override fun allWithRoles(): List<User>
    {
        return this.allWithRolesQuery()
                .fetchGroups(APP_USER)
                .map(this::mapUserWithRoles)
    }

    private fun allWithRolesQuery(): SelectOnConditionStep<Record>
    {
        return dsl.select()
                .from(APP_USER)
                .leftJoin(USER_GROUP_MEMBERSHIP)
                .on(USER_GROUP_MEMBERSHIP.USERNAME.eq(APP_USER.USERNAME))
                .leftJoin(USER_GROUP_ROLE)
                .on(USER_GROUP_ROLE.USER_GROUP.eq(USER_GROUP_MEMBERSHIP.USER_GROUP))
                .leftJoin(ROLE)
                .on(ROLE.ID.eq(USER_GROUP_ROLE.ROLE))
    }

    override fun addUser(user: CreateUser)
    {
        val newusername = user.username

        dsl.newRecord(APP_USER).apply {
            username = newusername
            name = user.name
            email = user.email
        }.insert()

        dsl.newRecord(USER_GROUP).apply {
            name = newusername
            id = newusername
        }.insert()

        dsl.newRecord(USER_GROUP_MEMBERSHIP).apply {
            username = newusername
            userGroup = newusername
        }.insert()
    }

    override fun setPassword(username: String, plainPassword: String)
    {
        val hashedPassword = UserHelper.hashedPassword(plainPassword)
        dsl.update(APP_USER).set(APP_USER.PASSWORD_HASH, hashedPassword)
                .where(APP_USER.USERNAME.eq(username))
                .execute()
    }

    override fun modifyMembership(groupId: String, associateUser: AssociateUser)
    {
        val roleId = dsl.getRole("member", "modelling-group")
                ?: throw UnknownRoleException("member", "modelling-group")

        // this throws an error if user does not exist
        getUser(associateUser.username)

        when (associateUser.action)
        {
            "add" ->
            {
                dsl.ensureUserHasRole(associateUser.username, roleId, groupId)
            }
            "remove" ->
            {
                removeRoleFromUser(associateUser.username, ReifiedRole("member",
                        Scope.Specific("modelling-group", groupId)))
            }
        }
    }

    private fun mapUserWithRoles(entry: Map.Entry<AppUserRecord, org.jooq.Result<Record>>): User
    {
        val user = entry.key.into(User::class.java)
        val roles = entry.value.filter { r -> r[USER_GROUP_ROLE.ROLE] != null }
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
        var scopeId = record[USER_GROUP_ROLE.SCOPE_ID]

        // set scopeId to null if USER_GROUP_ROLE.SCOPE_ID is an empty string,
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
        val scopeId = record[USER_GROUP_ROLE.SCOPE_ID]
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