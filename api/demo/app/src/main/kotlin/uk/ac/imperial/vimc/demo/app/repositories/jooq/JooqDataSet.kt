package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.TableField
import org.jooq.impl.TableImpl
import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.models.HasKey
import uk.ac.imperial.vimc.demo.app.repositories.DataSet

class JooqDataSet<out TModel : HasKey<TKey>, TKey : Any, TRepoModel : Record>(
        private val dsl: DSLContext,
        private val table: TableImpl<TRepoModel>,
        private val primaryKey: TableField<TRepoModel, TKey>,
        private val map: (TRepoModel) -> TModel,
        private val modelType: Class<*>)
    : DataSet<TModel, TKey> {

    override fun all(): Iterable<TModel> = dsl.fetch(table).map { map(it) }
    override fun get(key: TKey): TModel = map(fetch(key))

    private fun fetch(key: TKey) = dsl.fetchAny(table, primaryKey.eq(key))
            ?: throw UnknownObject(key, modelType.simpleName)

    companion object {
        inline fun <reified TModel : HasKey<TKey>, TKey: Any, TRepoModel : Record>
                new(dsl: DSLContext,
                    table: TableImpl<TRepoModel>,
                    primaryKey: TableField<TRepoModel, TKey>,
                    noinline map: (TRepoModel) -> TModel)
                = JooqDataSet(dsl, table, primaryKey, map, TModel::class.java)
    }
}