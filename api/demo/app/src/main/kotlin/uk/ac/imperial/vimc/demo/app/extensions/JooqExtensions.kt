package uk.ac.imperial.vimc.demo.app.extensions

import org.jooq.Field
import org.jooq.Record
import org.jooq.Select
import org.jooq.TableField

// Just a helper so we can write `fetchInto<T>` instead of `fetchInto(T::class.java)`
inline fun <reified TRecord : Record> Select<*>.fetchInto(): List<TRecord> = this.fetchInto(TRecord::class.java)

// This helper avoids overloading ambiguity when the field type is "Any"
fun <T> TableField<*, T>.eqField(otherField: Field<T>) = this.eq(otherField)