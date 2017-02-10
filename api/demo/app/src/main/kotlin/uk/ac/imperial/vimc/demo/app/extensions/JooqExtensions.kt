package uk.ac.imperial.vimc.demo.app.extensions

import org.jooq.Record
import org.jooq.Select

// Just a helper so we can write `fetchInto<T>` instead of `fetchInto(T::class.java)`
inline fun <reified TRecord: Record> Select<*>.fetchInto(): List<TRecord> = this.fetchInto(TRecord::class.java)