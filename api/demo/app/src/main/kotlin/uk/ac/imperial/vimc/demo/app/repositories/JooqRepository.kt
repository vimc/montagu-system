package uk.ac.imperial.vimc.demo.app.repositories

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.SQLDialect
import org.jooq.TableField
import org.jooq.impl.DSL
import org.jooq.impl.TableImpl
import uk.ac.imperial.vimc.demo.app.models.Country
import uk.ac.imperial.vimc.demo.app.models.HasKey
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.Scenario
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables
import java.sql.Connection
import java.sql.DriverManager

class JooqRepository : Repository, AutoCloseable {
    private val conn = DriverManager.getConnection("jdbc:postgresql://localhost:8888/vimc", "postgres", "")
    private val dsl = getDSL(conn)

    override val countries: DataSet<Country, String> = JooqDataSet(dsl, Tables.COUNTRY, Tables.COUNTRY.CODE, { Country(it.code, it.name) })
    override val scenarios: DataSet<Scenario, String>
        get() = TODO("not implemented") //To change initializer of created properties use File | Settings | File Templates.
    override val modellingGroups: DataSet<ModellingGroup, String>
        get() = TODO("not implemented") //To change initializer of created properties use File | Settings | File Templates.

    private fun getDSL(conn: Connection): DSLContext {
        return DSL.using(conn, SQLDialect.POSTGRES)
    }

    override fun close() {
        conn.close()
    }
}

class JooqDataSet<out TModel : HasKey<TKey>, TKey, TRepoModel : Record>(
        private val dsl: DSLContext,
        private val table: TableImpl<TRepoModel>,
        private val primaryKey: TableField<TRepoModel, TKey>,
        private val map: (TRepoModel) -> TModel) : DataSet<TModel, TKey> {

    override fun all(): Iterable<TModel> = dsl.fetch(table).map { map(it) }
    override fun get(key: TKey): TModel = map(dsl.fetchOne(table, primaryKey.eq(key)))

}
