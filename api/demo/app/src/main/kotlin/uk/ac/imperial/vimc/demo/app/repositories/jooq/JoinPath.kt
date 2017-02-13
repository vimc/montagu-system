package uk.ac.imperial.vimc.demo.app.repositories.jooq

import org.jooq.Record
import org.jooq.SelectFromStep
import org.jooq.SelectJoinStep
import org.jooq.TableField
import org.jooq.impl.TableImpl
import uk.ac.imperial.vimc.demo.app.extensions.eqField

/**
 * A JoinPath allows us to automatically construct the series of join operations needed
 * to get from table A -> B -> ... --> Z, assuming that there is a single foreign key between
 * each pair of tables, either from A->B or B->A.
 *
 * This is the same thing as jOOQ's join(...).onKey(), but because we have an ordering on the
 * tables we can avoid ambiguity which sometimes causes it to fail.
 *
 * It is intended that you would use this using the two extension methods below, `fromJoinPath`
 * at the beginning of a query, and `joinPath` to add more joins on to an existing query.
 */
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
    val field1: TableField<*, Any>
    val field2: TableField<*, Any>

    init {
        val reference = from.keys.flatMap { it.references }.filter { it.table == to }.singleOrNull()
            ?: throw Throwable("Attempted to construct join from $from to $to, but there is not exactly one foreign key")
        val fields = reference.fields
        field1 = fields.single { it.table == from } as TableField<*, Any>
        field2 = fields.single { it.table == to } as TableField<*, Any>
    }

    fun <T: Record> doJoin(query: SelectJoinStep<T>): SelectJoinStep<T> {
        return query.join(to).on(field1.eqField(field2))
    }
}

fun <T: Record> SelectJoinStep<T>.joinPath(tables: Iterable<TableImpl<*>>): SelectJoinStep<T> {
    return JoinPath(tables).doJoin(this)
}
fun <T: Record> SelectFromStep<T>.fromJoinPath(tables: Iterable<TableImpl<*>>): SelectJoinStep<T> {
    return this.from(tables.first()).joinPath<T>(tables)
}