package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.ReifiedPermission
import org.vaccineimpact.api.models.Scope
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.TouchstoneStatus

class TouchstoneController(private val db: () -> TouchstoneRepository) : AbstractController()
{
    override val urlComponent: String = "/touchstones"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getTouchstones, listOf("*/touchstones.read"))
    )

    fun getTouchstones(context: ActionContext): List<Touchstone>
    {
        var touchstones = db().use { it.touchstones.all() }
        if (!context.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }
}