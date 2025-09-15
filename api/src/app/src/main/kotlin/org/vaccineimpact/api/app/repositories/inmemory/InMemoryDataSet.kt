package org.vaccineimpact.api.app.repositories.inmemory

import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.models.HasKey

class InMemoryDataSet<out TModel : HasKey<TKey>, TKey : Any>(
        val models: List<TModel>
): SimpleDataSet<TModel, TKey>
{
    override fun all() = models

    override fun get(key: TKey) = models.singleOrNull { it.id == key }
        ?: throw UnknownObjectError(key, "unknown")

    override fun assertExists(key: TKey)
    {
        get(key)
    }
}