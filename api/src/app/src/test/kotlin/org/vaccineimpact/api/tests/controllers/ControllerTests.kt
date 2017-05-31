package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.junit.Test
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

data class RepositoryMock<out TRepository : Any>(
        val chooseRepo: (Repositories) -> (() -> TRepository),
        val repository: TRepository
)

abstract class ControllerTests<out TController : AbstractController> : MontaguTests()
{
    protected fun mockControllerContext(repository: RepositoryMock<*>) : ControllerContext
    {
        return mockControllerContext(repository, webTokenHelper = null)
    }
    protected fun mockControllerContext(
            vararg repositoryMocks: RepositoryMock<*>,
            webTokenHelper: WebTokenHelper?
    )
            : ControllerContext
    {
        val mockRepositories = mock<Repositories> {
            for (repositoryMock in repositoryMocks)
            {
                on { repositoryMock.chooseRepo(this) } doReturn { repositoryMock.repository }
            }
        }
        return mock {
            on { repositories } doReturn mockRepositories
            if (webTokenHelper != null)
            {
                on { tokenHelper } doReturn webTokenHelper
            }
        }
    }

    protected abstract fun makeController(controllerContext: ControllerContext): TController

    @Test
    fun `can get onetime link token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1",  ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
        }
        val tokenHelper = mock<WebTokenHelper> {
            on { generateOneTimeActionToken(any(), any()) } doReturn "MY-TOKEN"
        }
        val tokenRepo = mock<TokenRepository>()
        val controllerContext = mockControllerContext(
                RepositoryMock({ it.token }, tokenRepo),
                webTokenHelper = tokenHelper
        )

        // Behaviour under test
        val controller = makeController(controllerContext)
        controller.getOneTimeLinkToken(context, OneTimeAction.COVERAGE)

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters)
        verify(tokenRepo).storeToken("MY-TOKEN")
    }
}