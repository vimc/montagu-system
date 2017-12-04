package org.vaccineimpact.api.app.controllers

open class MontaguControllers(context: ControllerContext)
{
    open val auth = AuthenticationController(context)
    open val modellingGroup = ModellingGroupController(context)
    open val groupBurdenEstimates = GroupBurdenEstimatesController(context)
    open val user = UserController(context)
    open val model = ModelController(context)
    open val password = PasswordController(context)

    val all
        get() = listOf(
                auth,
                modellingGroup,
                groupBurdenEstimates,
                user,
                model,
                password
        )
}