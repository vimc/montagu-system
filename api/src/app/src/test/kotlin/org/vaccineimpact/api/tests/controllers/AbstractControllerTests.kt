package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class AbstractControllerTests : ControllerTests<AbstractController>()
{
    override fun makeController(controllerContext: ControllerContext): AbstractController
    {
        return Controller(controllerContext)
    }

    private class Controller(context: ControllerContext) : AbstractController(context)
    {
        override val urlComponent = "/test"
        override fun endpoints(repos: RepositoryFactory) = throw NotImplementedError("Not needed for tests")
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
        val parameters = mapOf(":a" to "1", ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
        }
        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()

        // Behaviour under test
        val controller = makeController(mockControllerContext(webTokenHelper = tokenHelper))
        controller.getOneTimeLinkToken(context, tokenRepo, OneTimeAction.COVERAGE)

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters, null, username = "test.user")
        verify(tokenRepo).storeToken("MY-TOKEN")
    }

    @Test
    fun `can get set password onetime token`()
    {
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val controllerContext = mockControllerContext(webTokenHelper = tokenHelper)
        val controller = makeController(controllerContext)
        controller.getSetPasswordToken("user", mock(), mock())
        verify(tokenHelper).generateOneTimeActionToken(
                eq("set-password"),
                argThat { this[":username"] == "user" },
                eq(null),
                eq(Duration.ofDays(1)),
                username = "test.user"
        )
    }

    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), username = "test.user") } doReturn "MY-TOKEN"
        on { oneTimeLinkLifeSpan } doReturn Duration.ofSeconds(30)
    }
}