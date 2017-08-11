package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.app.security.USER_OBJECT
import org.vaccineimpact.api.security.MontaguUser
import spark.Request
import spark.Response
import java.time.Instant

class RequestLogger(val accessLogRepository: () -> AccessLogRepository)
{
    fun log(req: Request, res: Response)
    {
        val principal = getPrincipal(req, res)
        val timestamp = Instant.now()
        val resource = req.pathInfo()
        val statusCode = res.status()
        accessLogRepository().use {
            it.log(principal, timestamp, resource, statusCode)
        }
    }

    private fun getPrincipal(req: Request, res: Response): String?
    {
        val context = DirectActionContext(req, res)
        val profile = context.userProfile
        if (profile != null)
        {
            val user = profile.getAttribute(USER_OBJECT) as MontaguUser
            return user.username
        }
        else
        {
            return null
        }
    }

    class Filter : spark.Filter
    {
        override fun handle(request: Request?, response: Response?)
        {
            TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
        }
    }
}