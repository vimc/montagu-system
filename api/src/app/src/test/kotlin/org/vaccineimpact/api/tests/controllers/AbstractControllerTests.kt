package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

class AbstractControllerTests : ControllerTests<AbstractController>()
{
    override fun makeController(controllerContext: ControllerContext): AbstractController
    {
        return Controller(controllerContext)
    }

    private class Controller(context: ControllerContext) : AbstractController(context)
    {
        override val urlComponent = "/test"
        override fun endpoints(repos: Repositories) = throw NotImplementedError("Not needed for tests")
    }

    @Test
    fun `can build public URL`()
    {
        val c = Controller(ControllerContext("/v6", mock(), mock()))
        assertThat(c.buildPublicUrl("/fragment/")).endsWith(
            "/v6/test/fragment/"
        )
    }

    @Test
    fun `can get onetime link token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1",  ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
        }
        val tokenHelper = mock<WebTokenHelper> {
            on { generateOneTimeActionToken(any(), any(), anyOrNull()) } doReturn "MY-TOKEN"
        }
        val tokenRepo = mock<TokenRepository>()
        val controllerContext = mockControllerContext(
                webTokenHelper = tokenHelper
        )

        // Behaviour under test
        val controller = makeController(controllerContext)
        controller.getOneTimeLinkToken(context, tokenRepo, OneTimeAction.COVERAGE)

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters, null)
        verify(tokenRepo).storeToken("MY-TOKEN")
    }
}