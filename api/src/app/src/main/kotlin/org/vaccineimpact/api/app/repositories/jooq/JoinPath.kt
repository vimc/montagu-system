package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.*
import org.jooq.impl.TableImpl
import org.vaccineimpact.api.app.errors.AmbiguousRelationBetweenTables
import org.vaccineimpact.api.app.errors.MissingRelationBetweenTables
import org.vaccineimpact.api.app.extensions.eqField
import org.vaccineimpact.api.app.extensions.getOther

/**
 * A JoinPath allows us to automatically construct the series of join operations needed
 * to get from type A -> B -> ... --> Z, assuming that there is a single foreign key between
 * each pair of tables, either from A->B or B->A.
 *
 * This is the same thing as jOOQ's join(...).onKey(), but because we have an ordering on the
 * tables we can avoid ambiguity which sometimes causes it to fail.
 *
 * It is intended that you would use this using the two extension methods below, `fromJoinPath`
 * at the beginning of a query, and `joinPath` to add more joins on to an existing query.
 */
class JoinPath(tables: Iterable<TableImpl<*>>)
{
    val steps = buildSteps(tables.toList()).toList()

    private fun buildSteps(tables: List<TableImpl<*>>): Iterable<JoinPathStep>
    {
        return tables.indices.drop(1).map { JoinPathStep(tables[it - 1], tables[it]) }
    }

    fun <T : Record> doJoin(initialQuery: SelectJoinStep<T>): SelectJoinStep<T>
    {
        return steps.fold(initialQuery, { query, step -> step.doJoin(query) })
    }
}

class JoinPathStep(private val from: TableImpl<*>, private val to: TableImpl<*>)
{
    val foreignKeyField: TableField<*, Any>
    val primaryKeyField: Field<Any>

    init
    {
        val references = from.keys.flatMap { it.references }.filter { it.table == to } +
                to.keys.flatMap { it.references }.filter { it.table == from }
        val reference = references.singleOrNull()
                ?: throwKeyProblem(references)
        foreignKeyField = reference.fields.single() as TableField<*, Any>
        val targetTable = foreignKeyField.table.getOther(from, to)
        primaryKeyField = targetTable.primaryKey.fields.single() as Field<Any>
    }

    private fun throwKeyProblem(keys: Iterable<ForeignKey<*, *>>): ForeignKey<*, *>
    {
        throw when (keys.count())
        {
            0 -> MissingRelationBetweenTables(from, to)
            else -> AmbiguousRelationBetweenTables(from, to)
        }
    }

    fun <T : Record> doJoin(query: SelectJoinStep<T>): SelectJoinStep<T>
    {
        return query.join(to).on(foreignKeyField.eqField(primaryKeyField))
    }
}

fun <T : Record> SelectJoinStep<T>.joinPath(vararg tables: TableImpl<*>): SelectJoinStep<T>
{
    return JoinPath(tables.toList()).doJoin(this)
}

fun <T : Record> SelectFromStep<T>.fromJoinPath(vararg tables: TableImpl<*>): SelectJoinStep<T>
{
    val query = this.from(tables.first())
    return JoinPath(tables.toList()).doJoin(query)
}