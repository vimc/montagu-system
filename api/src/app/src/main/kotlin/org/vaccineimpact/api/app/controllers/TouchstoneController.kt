package org.vaccineimpact.api.app.controllers

import org.vaccineimpact.api.app.controllers.endpoints.SecuredEndpoint
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.*
import spark.Request
import spark.Response

class TouchstoneController(private val db: () -> TouchstoneRepository) : AbstractController()
{
    override val urlComponent: String = "/touchstones"
    override val endpoints = listOf(
            SecuredEndpoint("/", this::getTouchstones, listOf("*/touchstones.read"))
    )

    fun getTouchstones(req: Request, res: Response): List<Touchstone>
    {
        var touchstones = db().use { it.touchstones.all() }
        val permissions = getPermissions(req, res)
        if (!permissions.hasPermission(ReifiedPermission("touchstones.prepare", Scope.Global())))
        {
            touchstones = touchstones.filter { it.status != TouchstoneStatus.IN_PREPARATION }
        }
        return touchstones.toList()
    }
}