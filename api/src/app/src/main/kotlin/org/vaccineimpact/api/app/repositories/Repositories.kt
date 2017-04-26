package org.vaccineimpact.api.app.repositories

class Repositories(
        val simpleObjectsRepository: () -> SimpleObjectsRepository,
        val touchstoneRepository: () -> TouchstoneRepository,
        val scenarioRepository: () -> ScenarioRepository,
        val modellingGroupRepository: () -> ModellingGroupRepository
)