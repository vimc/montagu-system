package org.vaccineimpact.api.app.repositories

class Repositories(
        val simpleObjectsRepository: () -> SimpleObjectsRepository,
        val userRepository: () -> UserRepository,
        val touchstoneRepository: () -> TouchstoneRepository,
        val scenarioRepository: () -> ScenarioRepository,
        val modellingGroupRepository: () -> ModellingGroupRepository
)