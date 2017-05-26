package org.vaccineimpact.api.app.repositories

open class Repositories(
        open val simpleObjects: () -> SimpleObjectsRepository,
        open val user: () -> UserRepository,
        open val token: () -> TokenRepository,
        open val touchstone: () -> TouchstoneRepository,
        open val scenario: () -> ScenarioRepository,
        open val modellingGroup: () -> ModellingGroupRepository
)