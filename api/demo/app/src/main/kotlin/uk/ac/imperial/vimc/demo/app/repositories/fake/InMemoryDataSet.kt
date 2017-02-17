package uk.ac.imperial.vimc.demo.app.repositories.fake

import uk.ac.imperial.vimc.demo.app.errors.UnknownObjectError
import uk.ac.imperial.vimc.demo.app.models.HasKey
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import java.lang.reflect.Type

class InMemoryDataSet<out TModel : HasKey<TKey>, TKey : Any>(private val items: Iterable<TModel>, private val type: Type) : DataSet<TModel, TKey>
{
    override fun all() = items
    override fun get(key: TKey) = items.filter { it.id == key }.singleOrNull() ?: throw UnknownObjectError(key, type.typeName)

    companion object
    {
        inline fun <reified TModel : HasKey<TKey>, TKey : Any> new(items: Iterable<TModel>)
                = InMemoryDataSet(items, TModel::class.java)
    }
}