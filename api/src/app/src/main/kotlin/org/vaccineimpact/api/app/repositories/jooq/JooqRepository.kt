package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.UnknownEnumValue
import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.db.JooqContext
import java.io.Closeable

abstract class JooqRepository(protected val db: JooqContext): Closeable
{
    val deserializer = Deserializer()
    val dsl get() = db.dsl

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

    override fun close()
    {
        db.close()
    }
}