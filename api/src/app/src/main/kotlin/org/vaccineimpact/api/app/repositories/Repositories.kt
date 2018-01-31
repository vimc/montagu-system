package org.vaccineimpact.api.app.repositories

import org.jooq.DSLContext
import org.jooq.exception.DataAccessException
import org.jooq.impl.DSL
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.JooqContext

open class RepositoryFactory
{
    open fun <T> inTransaction(work: (Repositories) -> T): T
    {
        return JooqContext().use { db ->
            Repositories(db.dsl).inTransaction(work)
        }
    }
}

open class Repositories(val dsl: DSLContext)
{
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

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

    open fun <T> inTransaction(work: (Repositories) -> T): T
    {
        var result: T? = null
        try
        {
            dsl.transaction { config ->
                val dsl = DSL.using(config)
                result = work(Repositories(dsl))
            }
        }
        catch (e: DataAccessException)
        {
            // We don't want our custom exceptions getting wrapped in a
            // Jooq rollback warning, so we rethrow the cause
            if (e.message == "Rollback caused")
            {
                logger.info("Rollback caused by: ${e.cause}")
                throw e.cause ?: e
            }
            else
            {
                throw e
            }
        }
        return result!!
    }
}