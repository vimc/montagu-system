package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.app.repositories.Repository

abstract class JooqRepository(val dsl: DSLContext): Repository
