package org.vaccineimpact.api.security

import org.jooq.DSLContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.models.Role
import java.security.SecureRandom
import java.util.*

object UserHelper
{
    fun saveUser(dsl: DSLContext, username: String, name: String, email: String, plainPassword: String)
    {
        val salt = newSalt()
        dsl.newRecord(APP_USER).apply {
            this.username = username
            this.name = name
            this.email = email
            this.passwordHash = hashedPassword(plainPassword, salt)
            this.salt = salt
        }.store()
    }

    fun hasRoleMapping(dsl: DSLContext, username: String, roleId: Int, scopeId: String): Boolean
    {
        val record = dsl.fetchAny(USER_ROLE, USER_ROLE.USERNAME
                .eq(username)
                .and(USER_ROLE.ROLE.eq(roleId))
                .and(USER_ROLE.SCOPE_ID.eq(scopeId)))
        return record != null
    }

    fun addRole(dsl: DSLContext, username: String, roleId: Int, scopeId: String)
    {
        dsl.newRecord(USER_ROLE).apply {
            this.username = username
            this.role = roleId
            this.scopeId = scopeId
        }.store()
    }

    fun getRole(dsl: DSLContext, roleName: String, roleScopePrefix: String?): Role?
    {
        val record = dsl.fetchAny(ROLE, ROLE.NAME
                .eq(roleName)
                .and(ROLE.SCOPE_PREFIX.isNotDistinctFrom(roleScopePrefix)))
        return record?.let { Role(record.id, record.name, record.scopePrefix, record.description) }
    }

    fun encoder(salt: String) = BasicSaltedSha512PasswordEncoder(salt)

    private fun hashedPassword(plainPassword: String, salt: String) = encoder(salt).encode(plainPassword)

    private fun newSalt(): String
    {
        val saltBytes = ByteArray(32)
        SecureRandom().nextBytes(saltBytes)
        return Base64.getEncoder().encodeToString(saltBytes)
    }

    fun suggestUsername(name: String): String
    {
        val names = name.toLowerCase().split(' ')
        var username = names.first()
        if (names.size > 1)
        {
            username = "${username}.${names.last()}"
        }
        return username
    }
}