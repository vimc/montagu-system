package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.ONETIME_TOKEN
import org.vaccineimpact.api.models.HasKey

class JooqTokenRepository(db: JooqContext) : JooqRepository(db), TokenRepository
{
    data class OneTimeToken(override val id: String): HasKey<String>

    override fun storeToken(token: String)
    {
        dsl.newRecord(ONETIME_TOKEN).apply {
            this.token = token
        }.store()
    }

    override fun validateOneTimeToken(token: String): Boolean
    {
        val deletedCount = dsl.deleteFrom(ONETIME_TOKEN)
                .where(ONETIME_TOKEN.TOKEN.eq(token))
                .execute()
        return deletedCount == 1
    }

}