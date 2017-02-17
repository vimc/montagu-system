package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.postgresql.util.PSQLException
import uk.ac.imperial.vimc.demo.app.Config
import uk.ac.imperial.vimc.demo.app.errors.UnableToConnectToDatabaseError
import java.sql.Connection
import java.sql.DriverManager

class JooqContext : AutoCloseable
{
    private val conn = getConnection()
    val dsl = createDSL(conn)

    private fun getConnection(): Connection
    {
        try
        {
            return DriverManager.getConnection(Config["db.url"], Config["db.username"], Config["db.password"])
        }
        catch (e: PSQLException)
        {
            throw UnableToConnectToDatabaseError()
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
