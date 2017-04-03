package org.vaccineimpact.api.app.filters

import org.jooq.Record
import org.jooq.SelectConditionStep
import org.jooq.SelectWhereStep

abstract class JooqFilterSet<in TParameters>
{
    abstract val filters: Iterable<JooqFilter<TParameters>>

    fun <T : Record> apply(initialContext: SelectConditionStep<T>, parameterValues: TParameters): SelectConditionStep<T>
    {
        var context = initialContext
        for (filter in filters)
        {
            context = filter.apply(context, parameterValues)
        }
        return context
    }
}

// Lets us use a JooqFilterSet in a fluent fashion
fun <TRecord : Record, TParameters> SelectConditionStep<TRecord>.whereMatchesFilter(
        filterSet: JooqFilterSet<TParameters>,
        parameterValues: TParameters
)
        = filterSet.apply(this, parameterValues)

// Helper that avoids us having to put a blank 'where' call in
fun <TRecord : Record, TParameters> SelectWhereStep<TRecord>.whereMatchesFilter(
        filterSet: JooqFilterSet<TParameters>,
        parameterValues: TParameters
)
        = this.where().whereMatchesFilter(filterSet, parameterValues)