package org.vaccineimpact.api.app.logic

import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.ModellingGroup
import org.vaccineimpact.api.models.Scope

interface ModellingGroupLogic
{
    fun getModellingGroupsForUser(userName: String): List<ModellingGroup>
}

class RepositoriesModellingGroupLogic(private val modellingGroupRepository: ModellingGroupRepository,
                                      private val userRepository: UserRepository) : ModellingGroupLogic
{
    override fun  getModellingGroupsForUser(userName: String): List<ModellingGroup>
    {
        val requestUser = userRepository.getUserByUsername(userName)

        val membershipRoles = requestUser.roles.filter{r -> r.name == "member"
                && r.scope is Scope.Specific && (r.scope as Scope.Specific).databaseScopePrefix == "modelling-group"}

        val modellingGroupIds = membershipRoles.map{r -> (r.scope as Scope.Specific).databaseScopeId}.distinct()

        return modellingGroupRepository.getModellingGroups(modellingGroupIds.toTypedArray()).toList()
    }
}