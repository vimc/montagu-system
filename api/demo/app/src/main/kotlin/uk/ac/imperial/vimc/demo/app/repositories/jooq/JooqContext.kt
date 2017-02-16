package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import uk.ac.imperial.vimc.demo.app.Config
import java.sql.Connection
import java.sql.DriverManager

class JooqContext : AutoCloseable
{
    private val conn = DriverManager.getConnection(Config["db.url"], Config["db.username"], Config["db.password"])
    val dsl = createDSL(conn)

    private fun createDSL(conn: Connection): DSLContext
    {
        return DSL.using(conn, SQLDialect.POSTGRES)
    }

    override fun close()
    {
        conn.close()
    }
}
