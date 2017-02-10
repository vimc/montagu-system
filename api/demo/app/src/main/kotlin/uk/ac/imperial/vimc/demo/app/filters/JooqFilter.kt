package uk.ac.imperial.vimc.demo.app.filters

import org.jooq.Record
import org.jooq.SelectConditionStep

interface JooqFilter<in TParameters> {
    fun <T: Record> apply(context: SelectConditionStep<T>, parameterValues: TParameters): SelectConditionStep<T>
}