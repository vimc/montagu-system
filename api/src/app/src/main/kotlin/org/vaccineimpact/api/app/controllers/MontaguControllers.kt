package org.vaccineimpact.api.app.controllers

open class MontaguControllers(context: ControllerContext)
{
    open val auth = AuthenticationController(context)
    open val disease = DiseaseController(context)
    open val touchstone = TouchstoneController(context)
    open val modellingGroup = ModellingGroupController(context)
    open val user = UserController(context)

    val all
        get() = listOf(auth, disease, touchstone, modellingGroup, user)
}