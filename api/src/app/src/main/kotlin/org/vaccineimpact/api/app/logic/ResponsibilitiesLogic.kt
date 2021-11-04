package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilityRow

interface ResponsibilitiesLogic
{
    fun validateResponsibilityPath(path: ResponsibilityPath, validTouchstoneStatusList: List<TouchstoneStatus>)
    fun getTouchstoneResponsibilitiesData(touchstoneVersionId: String): List<ResponsibilityRow>
}

class RepositoriesResponsibilitiesLogic(
        private val modellingGroupRepository: ModellingGroupRepository,
        private val scenarioRepository: ScenarioRepository,
        private val touchstoneRepository: TouchstoneRepository,
        private val responsibilitiesRepository: ResponsibilitiesRepository,
        private val burdenEstimateRepository: BurdenEstimateRepository
) : ResponsibilitiesLogic
{

    constructor(repositories: Repositories) : this(repositories.modellingGroup, repositories.scenario,
            repositories.touchstone, repositories.responsibilities, repositories.burdenEstimates)

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

    override fun getTouchstoneResponsibilitiesData(touchstoneVersionId: String): List<ResponsibilityRow>
    {
        val comments = responsibilitiesRepository.getResponsibilitiesWithCommentsForTouchstone(touchstoneVersionId)
        val sets = responsibilitiesRepository.getResponsibilitiesForTouchstone(touchstoneVersionId)
        return sets.flatMap { set ->
            val responsibilitySetComment = comments.find { it.modellingGroupId == set.modellingGroupId }?.comment
            set.responsibilities.flatMap { responsibility ->
                val burdenEstimateSets = burdenEstimateRepository.getBurdenEstimateSets(set.modellingGroupId,
                        touchstoneVersionId,
                        responsibility.scenario.id)
                val responsibilityComment = comments.find { it.modellingGroupId == set.modellingGroupId }
                        ?.responsibilities?.find { it.scenarioId == responsibility.scenario.id }?.comment
                burdenEstimateSets.map { estimates ->
                    ResponsibilityRow(
                            set.touchstoneVersion,
                            set.modellingGroupId,
                            set.responsibilities.size - set.responsibilities.count { it.currentEstimateSet?.status == BurdenEstimateSetStatus.COMPLETE },
                            responsibilitySetComment?.comment,
                            responsibilitySetComment?.addedOn,
                            responsibilitySetComment?.addedBy,
                            responsibility.scenario.description,
                            responsibility.scenario.disease,
                            estimates.id,
                            estimates.uploadedOn,
                            estimates.uploadedBy,
                            estimates.type.type,
                            estimates.type.details,
                            estimates.status,
                            estimates.problems.joinToString(),
                            responsibilityComment?.comment,
                            responsibilityComment?.addedOn,
                            responsibilityComment?.addedBy
                    )
                }

            }
        }
    }
}
