package org.vaccineimpact.api.databaseTests.tests

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.Router
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.ONETIME_TOKEN
import org.vaccineimpact.api.test_helpers.DatabaseTest

class TransactionalityTests : DatabaseTest()
{
    class SomeController(
            actionContext: ActionContext,
            private val repo: TokenRepository
    ) : Controller(actionContext)
    {
        constructor(actionContext: ActionContext, repositories: Repositories)
                : this(actionContext, repositories.token)

        fun endpoint()
        {
            repo.storeToken("TEST")
            throw Exception("This will make the transaction rollback")
        }
    }

    @Test
    fun `endpoint changes are made in a transaction`()
    {
        val router = Router(mock(), mock(), mock(), RepositoryFactory())
        val route = router.getWrappedRoute(Endpoint("/", SomeController::class, "endpoint"))
        route.handle(mock(), mock())

        assertThatThrownBy {
            route.handle(mock(), mock())
        }
        JooqContext().use { db ->
            assertThat(db.dsl.fetch(ONETIME_TOKEN)).isEmpty()
        }
    }
}