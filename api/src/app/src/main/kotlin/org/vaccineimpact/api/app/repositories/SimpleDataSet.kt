package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.HasKey

interface SimpleDataSet<out TModel : HasKey<TKey>, TKey>
{
    fun all(): Iterable<TModel>
    fun get(key: TKey): TModel
    fun assertExists(key: TKey): Unit
}