package org.vaccineimpact.api.databaseTests.tests

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.controllers.endpoints.Endpoint
import org.vaccineimpact.api.app.controllers.endpoints.getWrappedRoute
import org.vaccineimpact.api.app.controllers.endpoints.multiRepoEndpoint
import org.vaccineimpact.api.app.controllers.endpoints.oneRepoEndpoint
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.ONETIME_TOKEN
import org.vaccineimpact.api.test_helpers.DatabaseTest

class TransactionalityTests : DatabaseTest()
{
    @Test
    fun `oneRepoEndpoint changes are made in a transaction`()
    {
        val endpoint = makeFakeEndpoint { repo ->
            repo.storeToken("TEST")
            throw Exception("This will make the transaction rollback")
        }

        assertThatThrownBy {
            endpoint.getWrappedRoute().handle(mock(), mock())
        }
        JooqContext().use { db ->
            assertThat(db.dsl.fetch(ONETIME_TOKEN)).isEmpty()
        }
    }

    @Test
    fun `multiRepoEndpoint changes are made in a transaction`()
    {
        val endpoint = multiRepoEndpoint("/", { _, repos ->
            repos.token.storeToken("TEST")
        }, RepositoryFactory())

        assertThatThrownBy {
            endpoint.getWrappedRoute().handle(mock(), mock())
        }
        JooqContext().use { db ->
            assertThat(db.dsl.fetch(ONETIME_TOKEN)).isEmpty()
        }
    }

    private fun makeFakeEndpoint(handler: (TokenRepository) -> Unit): Endpoint<*>
    {
        return oneRepoEndpoint("/", { _, repo -> handler(repo) }, RepositoryFactory(), { it.token })
    }
}