package org.vaccineimpact.api.app.repositories

import org.jooq.Configuration
import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.JooqContext

open class Repositories(
        open val simpleObjects: () -> SimpleObjectsRepository,
        open val user: () -> UserRepository,
        open val token: () -> TokenRepository,
        open val accessLogRepository: () -> AccessLogRepository,
        open val modelRepository: () -> ModelRepository,
        open val touchstone: () -> TouchstoneRepository,
        open val scenario: () -> ScenarioRepository,
        open val modellingGroup: () -> ModellingGroupRepository,
        open val burdenEstimates: () -> BurdenEstimateRepository
)

fun makeRepositories(): Repositories
{
    fun simpleObjects(db: JooqContext, cfg: Configuration) = JooqSimpleObjectsRepository(db, cfg)
    fun user(db: JooqContext, cfg: Configuration) = JooqUserRepository(db, cfg)
    fun token(db: JooqContext, cfg: Configuration) = JooqTokenRepository(db, cfg)
    fun accessLogRepository(db: JooqContext, cfg: Configuration) = JooqAccessLogRepository(db, cfg)
    fun model(db: JooqContext, cfg: Configuration) = JooqModelRepository(db, cfg)
    fun scenario(db: JooqContext, cfg: Configuration) = JooqScenarioRepository(db, cfg)
    fun touchstone(db: JooqContext, cfg: Configuration) = JooqTouchstoneRepository(db, scenario(db, cfg))
    fun modellingGroup(db: JooqContext, cfg: Configuration) = JooqModellingGroupRepository(db, touchstone(db, cfg), scenario(db, cfg))
    fun burdenEstimates(db: JooqContext, cfg: Configuration) = JooqBurdenEstimateRepository(db, cfg, modellingGroup(db, cfg))

    return Repositories(
            wrapRepository(::simpleObjects),
            wrapRepository(::user),
            wrapRepository(::token),
            wrapRepository(::accessLogRepository),
            wrapRepository(::model),
            wrapRepository(::touchstone),
            wrapRepository(::scenario),
            wrapRepository(::modellingGroup),
            wrapRepository(::burdenEstimates)
    )
}

/** Given that we have a repository 'factory' - a function that constructs a repository
 * using a JooqContext - this gives us a new, parameter-less function.
 * Every time this new function is invoked, a new instance of the repository is returned
 * with a new JooqContext instance.
 * It is up to the consumer of the repository to close the repository (and thus the
 * JooqContext
 */
private fun <T : Repository> wrapRepository(factory: (JooqContext, Configuration) -> T): () -> T
{
    return {
        val db = JooqContext()
        var result: T? = null
        db.dsl.transaction { config ->
            result = factory(db, config)
            //Implicitly committed, unless an exception is thrown
        }
        result!!
    }
}