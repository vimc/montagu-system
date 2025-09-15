package uk.ac.imperial.vimc.demo.app.filters

import org.jooq.Field
import org.jooq.Record
import org.jooq.SelectConditionStep

class JooqEqualityFilter<in TParameters, out TField>(
        private val field: Field<TField>,
        val mapper: (TParameters) -> TField) : JooqFilter<TParameters>
{

    override fun <T : Record> apply(context: SelectConditionStep<T>, parameterValues: TParameters): SelectConditionStep<T>
    {
        val parameterValue = mapper(parameterValues)
        if (parameterValue != null)
        {
            return context.and(field.eq(parameterValue))
        } else
        {
            return context
        }
    }
}