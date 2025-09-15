package org.vaccineimpact.api.app.filters

import org.jooq.Record
import org.jooq.SelectConditionStep

interface JooqFilter<in TParameters>
{
    fun <T : Record> apply(context: SelectConditionStep<T>, parameterValues: TParameters): SelectConditionStep<T>
}