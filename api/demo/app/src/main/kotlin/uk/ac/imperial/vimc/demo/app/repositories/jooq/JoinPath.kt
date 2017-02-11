package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.*
import org.jooq.impl.TableImpl

class JoinPath(tables: Iterable<TableImpl<*>>) {
    val steps = buildSteps(tables.toList()).toList()

    private fun buildSteps(tables: List<TableImpl<*>>): Iterable<JoinPathStep> {
        return tables.indices.drop(1).map { JoinPathStep(tables[it - 1], tables[it]) }
    }

    fun <T: Record> doJoin(initialQuery: SelectJoinStep<T>): SelectJoinStep<T> {
        return steps.fold(initialQuery, { query, step -> step.doJoin(query) })
    }
}

class JoinPathStep(from: TableImpl<*>, val to: TableImpl<*>) {
    val foreignKeyField : TableField<*, Any>
    val targetKeyField : Field<Any>

    init {
        val reference = from.keys.flatMap { it.references }.filter { it.table == to }.singleOrNull()
            ?: throw Throwable("Attempted to construct join from $from to $to, but there is not exactly one foreign key")
        val fields = reference.fields
        foreignKeyField = fields.single { it.table == from } as TableField<*, Any>
        targetKeyField = fields.single { it.table == to } as Field<Any>
    }

    fun <T: Record> doJoin(query: SelectJoinStep<T>) = doJoin(query, foreignKeyField, targetKeyField)

    private fun <TRecord: Record, TField> doJoin(
            query: SelectJoinStep<TRecord>,
            foreignKeyField: TableField<*, TField>,
            targetKeyField: Field<TField>): SelectJoinStep<TRecord>  {
        return query.join(to).on(foreignKeyField.eq(targetKeyField))
    }
}

fun <T: Record> SelectJoinStep<T>.joinPath(tables: Iterable<TableImpl<*>>): SelectJoinStep<T> {
    return JoinPath(tables).doJoin(this)
}
fun <T: Record> SelectFromStep<T>.fromJoinPath(tables: Iterable<TableImpl<*>>): SelectJoinStep<T> {
    return this.from(tables.first()).joinPath<T>(tables)
}