package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.vaccineimpact.api.app.Config
import org.vaccineimpact.api.app.errors.UnableToConnectToDatabaseError
import java.sql.Connection
import java.sql.DriverManager

class JooqContext(val dbName: String? = null) : AutoCloseable
{
    private val conn = getConnection()
    val dsl = createDSL(conn)

    private fun getConnection(): Connection
    {
        val dbHost = Config["db.host"]
        val dbPort = Config["db.port"]
        val dbName = dbName ?: Config["db.name"]
        val url = "jdbc:postgresql://$dbHost:$dbPort/$dbName"
        try
        {
            return DriverManager.getConnection(url, Config["db.username"], Config["db.password"])
        }
        catch (e: Exception)
        {
            throw UnableToConnectToDatabaseError(url)
        }
    }

    private fun createDSL(conn: Connection): DSLContext
    {
        return DSL.using(conn, SQLDialect.POSTGRES)
    }

    override fun close()
    {
        conn.close()
    }
}
