package org.vaccineimpact.api.app.repositories

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
        open val modellingGroup: () -> ModellingGroupRepository
)

fun makeRepositories(): Repositories
{
    fun simpleObjects(db: JooqContext) = JooqSimpleObjectsRepository(db)
    fun user(db: JooqContext) = JooqUserRepository(db)
    fun token(db: JooqContext) = JooqTokenRepository(db)
    fun accessLogRepository(db: JooqContext) = JooqAccessLogRepository(db)
    fun model(db: JooqContext) = JooqModelRepository(db)
    fun scenario(db: JooqContext) = JooqScenarioRepository(db)
    fun touchstone(db: JooqContext) = JooqTouchstoneRepository(db, scenario(db))
    fun modellingGroup(db: JooqContext) = JooqModellingGroupRepository(db, touchstone(db), scenario(db))

    return Repositories(
            wrapRepository(::simpleObjects),
            wrapRepository(::user),
            wrapRepository(::token),
            wrapRepository(::accessLogRepository),
            wrapRepository(::model),
            wrapRepository(::touchstone),
            wrapRepository(::scenario),
            wrapRepository(::modellingGroup)
    )
}

/** Given that we have a repository 'factory' - a function that constructs a repository
 * using a JooqContext - this gives us a new, parameter-less function.
 * Every time this new function is invoked, a new instance of the repository is returned
 * with a new JooqContext instance.
 * It is up to the consumer of the repository to close the repository (and thus the
 * JooqContext
 */
private fun <T : Repository> wrapRepository(factory: (JooqContext) -> T): () -> T
{
    return { factory(JooqContext()) }
}