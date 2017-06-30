package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.app.repositories.jooq.*
import org.vaccineimpact.api.db.JooqContext

open class Repositories(
        open val simpleObjects: (JooqContext) -> SimpleObjectsRepository,
        open val user: (JooqContext) -> UserRepository,
        open val token: (JooqContext) -> TokenRepository,
        open val touchstone: (JooqContext) -> TouchstoneRepository,
        open val scenario: (JooqContext) -> ScenarioRepository,
        open val modellingGroup: (JooqContext) -> ModellingGroupRepository
)

fun makeRepositories(): Repositories
{
    val scenarioRepository: (JooqContext) -> ScenarioRepository = { JooqScenarioRepository(it) }
    val touchstoneRepository: (JooqContext) -> TouchstoneRepository = {
        JooqTouchstoneRepository(it, scenarioRepository(it))
    }
    return Repositories(
            { JooqSimpleObjectsRepository(it) },
            { JooqUserRepository(it) },
            { JooqTokenRepository(it) },
            touchstoneRepository,
            scenarioRepository,
            { JooqModellingGroupRepository(it, touchstoneRepository(it), scenarioRepository(it)) }
    )
}