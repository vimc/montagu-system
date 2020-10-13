package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.app.repositories.Repository
import org.vaccineimpact.api.app.repositories.jooq.mapping.MappingHelper
import org.vaccineimpact.api.db.tables.records.CoverageRecord
import java.math.BigDecimal

abstract class JooqRepository(val dsl: DSLContext): Repository
{
}