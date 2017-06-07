package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.Deserializer
import org.vaccineimpact.api.UnknownEnumValue
import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.app.errors.UnableToConnectToDatabaseError
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.UnableToConnectToDatabase
import java.io.Closeable

abstract class JooqRepository : Closeable
{
    private val context = makeContext()
    val deserializer = Deserializer()
    val dsl = context.dsl

    override fun close()
    {
        context.close()
    }

    private fun makeContext(): JooqContext
    {
        try
        {
            return JooqContext()
        }
        catch (e: UnableToConnectToDatabase)
        {
            throw UnableToConnectToDatabaseError(e.url)
        }
    }

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