package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.app.repositories.Repository
import org.vaccineimpact.api.app.repositories.jooq.mapping.MappingHelper

abstract class JooqRepository(val dsl: DSLContext): Repository