package org.vaccineimpact.api.app.security

import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.security.OneTimeTokenChecker

class JooqOneTimeTokenChecker(private val repositoryFactory: RepositoryFactory) : OneTimeTokenChecker
{
    override fun checkOneTimeTokenExistsAndRemoveIt(token: String): Boolean
    {
        // This transaction is immediately committed, regardless of result
        return repositoryFactory.inTransaction { repos ->
            repos.token.validateOneTimeToken(token)
        }
    }
}