package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.serialization.Deserializer
import org.vaccineimpact.api.serialization.UnknownEnumValue
import org.vaccineimpact.api.app.errors.BadDatabaseConstant
import org.vaccineimpact.api.app.repositories.Repository

abstract class JooqRepository(
        val dsl: DSLContext,
        val mapper: MappingHelpers = MappingHelpers()
): Repository