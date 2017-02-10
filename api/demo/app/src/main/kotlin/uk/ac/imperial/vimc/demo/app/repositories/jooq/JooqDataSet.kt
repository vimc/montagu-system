package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.TableField
import org.jooq.impl.TableImpl
import uk.ac.imperial.vimc.demo.app.models.HasKey
import uk.ac.imperial.vimc.demo.app.repositories.DataSet

class JooqDataSet<out TModel : HasKey<TKey>, TKey, TRepoModel : Record>(
        private val dsl: DSLContext,
        private val table: TableImpl<TRepoModel>,
        private val primaryKey: TableField<TRepoModel, TKey>,
        private val map: (TRepoModel) -> TModel) : DataSet<TModel, TKey> {

    override fun all(): Iterable<TModel> = dsl.fetch(table).map { map(it) }
    override fun get(key: TKey): TModel = map(dsl.fetchOne(table, primaryKey.eq(key)))
}