package org.vaccineimpact.api.app.repositories

import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.JooqContext

open class RepositoryFactory
{
    open fun <T> inTransaction(work: (Repositories) -> T): T
    {
        var result: T? = null
        JooqContext().use { db ->
            db.dsl.transaction { config ->
                val dsl = DSL.using(config)
                result = work(Repositories(dsl))
            }
        }
        return result!!
    }
}

open class Repositories(val dsl: DSLContext)
{
    open val simpleObjects: SimpleObjectsRepository by lazy {
        JooqSimpleObjectsRepository(dsl)
    }
    open val user: UserRepository by lazy {
        JooqUserRepository(dsl)
    }
    open val token: TokenRepository by lazy {
        JooqTokenRepository(dsl)
    }
    open val accessLogRepository: AccessLogRepository by lazy {
        JooqAccessLogRepository(dsl)
    }
    open val modelRepository: ModelRepository by lazy {
        JooqModelRepository(dsl)
    }
    open val touchstone: TouchstoneRepository by lazy {
        JooqTouchstoneRepository(dsl, scenario)
    }
    open val scenario: ScenarioRepository by lazy {
        JooqScenarioRepository(dsl)
    }
    open val modellingGroup: ModellingGroupRepository by lazy {
        JooqModellingGroupRepository(dsl, touchstone, scenario)
    }
    open val burdenEstimates: BurdenEstimateRepository by lazy {
        JooqBurdenEstimateRepository(dsl, scenario, touchstone, modellingGroup)
    }
}