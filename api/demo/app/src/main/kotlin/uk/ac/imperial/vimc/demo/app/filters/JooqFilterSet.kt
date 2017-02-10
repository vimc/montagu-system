package uk.ac.imperial.vimc.demo.app.filters

import org.jooq.Record
import org.jooq.SelectConditionStep

abstract class JooqFilterSet<in TParameters, TModel: Record> {
    abstract val filters : Iterable<JooqFilter<TParameters, TModel>>

    fun apply(initialContext: SelectConditionStep<TModel>, parameterValues: TParameters): SelectConditionStep<TModel> {
        return filters.fold(initialContext, { context, filter -> filter.apply(context, parameterValues) })
    }
}