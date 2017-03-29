package org.vaccineimpact.api.app.repositories

class Repositories(
        val touchstoneRepository: () -> TouchstoneRepository,
        val modellingGroupRepository: () -> ModellingGroupRepository
)