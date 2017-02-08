package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.models.HasKey
import java.lang.reflect.Type

class InMemoryDataSet<out TModel : HasKey<TKey>, TKey: Any>(private val items: Iterable<TModel>, private val type: Type) : DataSet<TModel, TKey> {
    override fun all() = items
    override fun get(key: TKey) = items.filter { it.key == key }.singleOrNull() ?: throw UnknownObject(key, type.typeName)

    companion object {
        inline fun <reified TModel : HasKey<TKey>, TKey: Any> new(items: Iterable<TModel>)
                = InMemoryDataSet(items, TModel::class.java)
    }
}