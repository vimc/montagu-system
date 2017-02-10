package uk.ac.imperial.vimc.demo.app.filters

import org.jooq.Field
import org.jooq.Record
import org.jooq.SelectConditionStep

class JooqEqualityFilter<in TParameters, TModel: Record, TField>(
        val field: Field<TField>,
        val mapper: (TParameters) -> TField): JooqFilter<TParameters, TModel> {

    override fun apply(context: SelectConditionStep<TModel>, parameterValues: TParameters): SelectConditionStep<TModel> {
        val parameterValue = mapper(parameterValues)
        if (parameterValue != null) {
            return context.and(field.eq(parameterValue))
        } else {
            return context
        }
    }
}