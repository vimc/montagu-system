package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.RepositoryFactory
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class AbstractControllerTests : ControllerTests<AbstractController>()
{
    override fun makeController(controllerContext: ControllerContext): AbstractController
    {
        return Controller(controllerContext)
    }

    private class Controller(context: ControllerContext,
                             redirectValidator: RedirectValidator = mock<RedirectValidator>())
        : AbstractController(context, redirectValidator)
    {
        override val urlComponent = "/test"
        override fun endpoints(repos: RepositoryFactory) = throw NotImplementedError("Not needed for tests")
    }

    @Test
    fun `can build public URL`()
    {
        val c = Controller(ControllerContext("/v6", mock(), mock()))
        assertThat(c.buildPublicUrl("/fragment/")).endsWith(
                "/v6/fragment/"
        )
    }

    // This test is now duplicated in TokenGeneratorTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `can get onetime link token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
            on { username } doReturn "test.user"
        }
        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()

        // Behaviour under test
        val controller = makeController(mockControllerContext(webTokenHelper = tokenHelper))
        controller.getOneTimeLinkToken(context, tokenRepo, OneTimeAction.COVERAGE)

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters, null, WebTokenHelper.oneTimeLinkLifeSpan, "test.user")
        verify(tokenRepo).storeToken("MY-TOKEN")
    }

    // This test is now duplicated in TokenGeneratorTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `throws error if redirect param is invalid`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
            on { username } doReturn "test.user"
            on { queryParams("redirectUrl") } doReturn "www.redirect.com"
         }
        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val redirectValidator = mock<RedirectValidator>{
            on (it.validateRedirectUrl(any())) doThrow BadRequest("bad request")
        }

        // Behaviour under test
        val controller = Controller(mockControllerContext(webTokenHelper = tokenHelper),
                redirectValidator)

        assertThatThrownBy {
            controller.getOneTimeLinkToken(context, tokenRepo, OneTimeAction.COVERAGE)
        }.isInstanceOf(BadRequest::class.java)
    }

    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
    }
}