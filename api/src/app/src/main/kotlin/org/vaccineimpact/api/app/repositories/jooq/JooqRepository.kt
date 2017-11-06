package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.UnknownEnumValue
import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.app.repositories.Repository

abstract class JooqRepository(val dsl: DSLContext): Repository
{
    val deserializer = Deserializer()

    protected inline fun <reified T: Enum<T>> mapEnum(raw: String): T
    {
        return try
        {
            deserializer.parseEnum<T>(raw)
        }
        catch (e: UnknownEnumValue)
        {
            throw BadDatabaseConstant(e.name, e.type)
        }
    }
}