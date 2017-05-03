package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.db.Tables.APP_USER
import org.vaccineimpact.api.db.tables.records.AppUserRecord
import org.vaccineimpact.api.models.User

class JooqUserRepository : JooqRepository(), UserRepository
{
    override fun getUserByEmail(email: String): User?
            = dsl.fetchAny(APP_USER, caseInsensitiveEmailMatch(email))?.mapUser()

    private fun caseInsensitiveEmailMatch(email: String)
            = APP_USER.EMAIL.lower().eq(email.toLowerCase())

    fun AppUserRecord.mapUser() = User(
            this.username,
            this.name,
            this.email,
            this.passwordHash,
            this.salt,
            this.lastLoggedIn
    )
}