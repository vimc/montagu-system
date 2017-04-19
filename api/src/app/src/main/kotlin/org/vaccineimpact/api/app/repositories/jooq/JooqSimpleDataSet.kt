package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.TableField
import org.jooq.impl.TableImpl
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.models.HasKey
import org.vaccineimpact.api.app.repositories.SimpleDataSet

class JooqSimpleDataSet<out TModel : HasKey<TKey>, TKey : Any, TRepoModel : Record, TTable : TableImpl<TRepoModel>>(
        private val dsl: DSLContext,
        private val table: TTable,
        primaryKey: (TTable) -> TableField<TRepoModel, TKey>,
        private val map: (TRepoModel) -> TModel,
        private val modelType: Class<*>)
    : SimpleDataSet<TModel, TKey>
{
    private val primaryKey = primaryKey(table)

    override fun all(): Iterable<TModel> = dsl.fetch(table).map { map(it) }
    override fun get(key: TKey): TModel = map(fetch(key))
    override fun assertExists(key: TKey)
    {
        // This will throw an exception if the object doesn't exist
        fetch(key)
    }

    private fun fetch(key: TKey) = dsl.fetchAny(table, primaryKey.eq(key))
            ?: throw UnknownObjectError(key, modelType.simpleName)

    companion object
    {
        inline fun <reified TModel : HasKey<TKey>, TKey : Any, TRepoModel : Record, TTable : TableImpl<TRepoModel>>
                new(dsl: DSLContext,
                    table: TTable,
                    noinline primaryKey: (TTable) -> TableField<TRepoModel, TKey>,
                    noinline map: (TRepoModel) -> TModel)
                = JooqSimpleDataSet(dsl, table, primaryKey, map, TModel::class.java)
    }
}