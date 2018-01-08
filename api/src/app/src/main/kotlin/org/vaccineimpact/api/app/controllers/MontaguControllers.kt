package org.vaccineimpact.api.app.controllers

open class MontaguControllers(context: ControllerContext)
{
    open val modellingGroup = ModellingGroupController(context)
    open val groupBurdenEstimates = GroupBurdenEstimatesController(context)

    val all
        get() = listOf(
                modellingGroup,
                groupBurdenEstimates
        )
}