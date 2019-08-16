package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion

interface ResponsibilitiesLogic
{
    fun validateResponsibilityPath(path: ResponsibilityPath, validTouchstoneStatusList: List<TouchstoneStatus>)
}

class RepositoriesResponsibilitiesLogic(
        private val modellingGroupRepository: ModellingGroupRepository,
        private val scenarioRepository: ScenarioRepository,
        private val touchstoneRepository: TouchstoneRepository
) : ResponsibilitiesLogic
{

    override fun validateResponsibilityPath(
            path: ResponsibilityPath,
            validTouchstoneStatusList: List<TouchstoneStatus>
    )
    {
        //Check that modelling group exists
        modellingGroupRepository.getModellingGroup(path.groupId)
        //Check touchstone and is accessible for this user
        val touchstoneVersion = touchstoneRepository.touchstoneVersions.get(path.touchstoneVersionId)
        if (!validTouchstoneStatusList.contains(touchstoneVersion.status))
        {
            throw UnknownObjectError(touchstoneVersion.id, TouchstoneVersion::class)
        }

        scenarioRepository.checkScenarioDescriptionExists(path.scenarioId)
    }
}