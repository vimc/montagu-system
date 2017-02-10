package uk.ac.imperial.vimc.demo.app.filters

import org.jooq.Record
import org.jooq.SelectConditionStep

interface JooqFilter<in TParameters, TModel: Record> {
    fun apply(context: SelectConditionStep<TModel>, parameterValues: TParameters): SelectConditionStep<TModel>
}