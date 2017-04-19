package org.vaccineimpact.api.app.repositories.jooq

import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.TOUCHSTONE
import org.vaccineimpact.api.db.tables.records.TouchstoneRecord
import uk.ac.imperial.vimc.demo.app.repositories.jooq.JooqSimpleDataSet

class JooqTouchstoneRepository : JooqRepository(), TouchstoneRepository
{
    override val touchstones: SimpleDataSet<Touchstone, String>
        get() = JooqSimpleDataSet.new(dsl, TOUCHSTONE, { it.ID }, { mapTouchstone(it) })

    fun mapTouchstone(record: TouchstoneRecord) = Touchstone(
            record.id,
            record.touchstoneName,
            record.version,
            record.description,
            record.yearStart..record.yearEnd,
            mapEnum(record.status)
    )
}