package org.vaccineimpact.api.db

import org.jooq.*
import org.jooq.impl.TableImpl
import org.postgresql.copy.CopyManager
import java.io.InputStream

// Just a helper so we can write `fetchInto<T>` instead of `fetchInto(T::class.java)`
inline fun <reified TRecord : Record> Select<*>.fetchInto(): List<TRecord> = this.fetchInto(TRecord::class.java)

// This helper avoids overloading ambiguity when the field type is "Any"
fun <T> TableField<*, T>.eqField(otherField: Field<T>): Condition = this.eq(otherField)

fun TableImpl<*>.fieldsAsList() = this.fields().toList()

fun CopyManager.copyInto(table: TableImpl<*>, stream: InputStream, fields: List<Field<*>>)
{
    val fieldList = fields.joinToString(", ") { it.name }
    val query = "COPY ${table.name} ($fieldList) FROM STDIN"
    this.copyIn(query, stream)
}

fun DSLContext.withoutCheckingForeignKeyConstraints(table: TableImpl<*>, work: () -> Unit)
{
    val triggers = this.getTriggersFor(table)
    try
    {
        triggers.forEach { this.setTriggerEnabled(table, it, Toggle.Disable) }
        work()
    }
    finally
    {
        triggers.forEach { this.setTriggerEnabled(table, it, Toggle.Enable) }
    }
}

private fun DSLContext.getTriggersFor(table: TableImpl<*>): List<String>
{
    // https://www.postgresql.org/docs/9.1/static/catalog-pg-trigger.html
    val query = """SELECT tgname FROM pg_trigger
JOIN pg_class pg_class_native  ON pg_trigger.tgrelid = pg_class_native.oid
JOIN pg_class pg_class_foreign ON pg_trigger.tgconstrrelid = pg_class_foreign.oid
WHERE pg_class_native.relname = '${table.name}'"""

    return this.fetch(query).map { it["tgname"] as String }
}

private fun DSLContext.setTriggerEnabled(table: TableImpl<*>, triggerName: String, action: Toggle)
{
    val functionName = when (action)
    {
        Toggle.Enable -> "enable_trigger"
        Toggle.Disable -> "disable_trigger"
    }
    this.execute("""SELECT FROM $functionName('${table.name}', '$triggerName')""")
}

enum class Toggle
{
    Enable,
    Disable
}