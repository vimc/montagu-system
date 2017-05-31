package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.repositories.Repositories

class MontaguControllers(context: ControllerContext)
{
    val auth = AuthenticationController(context)
    val disease = DiseaseController(context)
    val touchstone = TouchstoneController(context)
    val modellingGroup = ModellingGroupController(context)

    val all
        get() = listOf(auth, disease, touchstone, modellingGroup)
}