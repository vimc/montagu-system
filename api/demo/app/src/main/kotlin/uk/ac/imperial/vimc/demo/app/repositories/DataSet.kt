package uk.ac.imperial.vimc.demo.app.repositories

import uk.ac.imperial.vimc.demo.app.models.HasKey

interface DataSet<out TModel : HasKey<TKey>, TKey>
{
    fun all(): Iterable<TModel>
    fun get(key: TKey): TModel
}