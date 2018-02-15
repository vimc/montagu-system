package org.vaccineimpact.api.app

import org.vaccineimpact.api.app.context.DirectActionContext
import org.vaccineimpact.api.app.repositories.AccessLogRepository
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.security.internalUser
import spark.Request
import spark.Response
import spark.Spark
import java.time.Instant

class RequestLogger(private val accessLogRepository: AccessLogRepository)
{
    fun log(req: Request, res: Response)
    {
        val principal = getPrincipal(req, res)
        val timestamp = Instant.now()
        val resource = req.pathInfo()
        val statusCode = res.status()
        val ip = req.ip()
        accessLogRepository.log(principal, timestamp, resource, statusCode, ip)
    }

    private fun getPrincipal(req: Request, res: Response): String?
    {
        val context = DirectActionContext(req, res)
        val profile = context.userProfile

        // There are two sources of the user's username, depending on whether they
        // authenticated using HTTP Basic Auth (only for the /authenticate endpoint)
        // or whether they authenticated using a token.
        // We can't unify the two approaches as we have different information in
        // the two cases: We have the full user retrieved from the db in the first
        // case, and only what's in the token in the second case.
        return profile?.internalUser?.username
                ?: context.username
    }

    companion object
    {
        fun setup(repositoryFactory: RepositoryFactory)
        {
            // afterAfter acts as a 'finally' block: It runs after any 'after' filters
            // and it runs regardless of whether the request results in an error
            Spark.afterAfter("*", { req, res ->
                repositoryFactory.inTransaction { repos ->
                    RequestLogger(repos.accessLogRepository).log(req, res)
                }
            })
        }
    }
}