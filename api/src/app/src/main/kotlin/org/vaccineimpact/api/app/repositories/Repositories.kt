package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.repositories.jooq.*

open class Repositories(
        open val simpleObjects: () -> SimpleObjectsRepository,
        open val user: () -> UserRepository,
        open val token: () -> TokenRepository,
        open val touchstone: () -> TouchstoneRepository,
        open val scenario: () -> ScenarioRepository,
        open val modellingGroup: () -> ModellingGroupRepository,
        open val model: () -> ModelRepository
)

fun makeRepositories(): Repositories
{
    val simpleObjectsRepository = { JooqSimpleObjectsRepository() }
    val userRepository = { JooqUserRepository() }
    val tokenRepository = { JooqTokenRepository() }
    val scenarioRepository = { JooqScenarioRepository() }
    val touchstoneRepository = { JooqTouchstoneRepository(scenarioRepository) }
    val modellingGroupRepository = { JooqModellingGroupRepository(touchstoneRepository, scenarioRepository) }
    val modelRepository = { JooqModelRepository() }

    return Repositories(
            simpleObjectsRepository,
            userRepository,
            tokenRepository,
            touchstoneRepository,
            scenarioRepository,
            modellingGroupRepository,
            modelRepository
    )
}