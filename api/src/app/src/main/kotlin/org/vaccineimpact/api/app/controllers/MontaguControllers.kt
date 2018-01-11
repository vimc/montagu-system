package org.vaccineimpact.api.app.controllers

open class MontaguControllers(context: ControllerContext)
{
    open val groupBurdenEstimates = GroupBurdenEstimatesController(context)

    val all
        get() = listOf(
                groupBurdenEstimates
        )
}