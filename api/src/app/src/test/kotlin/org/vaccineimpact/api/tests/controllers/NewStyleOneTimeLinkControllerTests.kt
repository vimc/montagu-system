package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.emails.EmailManager
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class NewStyleOneTimeLinkControllerTests : MontaguTests()
{
    // This test is duplicated from AbstractControllerTests, during our period of overlap
    // between the old and new style controllers. Changes made here should be duplicated
    // back to the old test until that test is removed.
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
        val controller = NewStyleOneTimeLinkController(context, tokenRepo, mock<UserRepository>(), mock<EmailManager>(), tokenHelper)
        controller.getOneTimeLinkToken(OneTimeAction.COVERAGE)

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters, null, username = "test.user")
        verify(tokenRepo).storeToken("MY-TOKEN")
    }

    // This test is duplicated from AbstractControllerTests, during our period of overlap
    // between the old and new style controllers. Changes made here should be duplicated
    // back to the old test until that test is removed.
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
        val redirectValidator = mock<RedirectValidator> {
            on(it.validateRedirectUrl(any())) doThrow BadRequest("bad request")
        }

        // Behaviour under test
        val controller = NewStyleOneTimeLinkController(
                context, tokenRepo, mock<UserRepository>(), mock<EmailManager>(), tokenHelper,
                redirectValidator = redirectValidator
        )
        assertThatThrownBy {
            controller.getOneTimeLinkToken(OneTimeAction.COVERAGE)
        }.isInstanceOf(BadRequest::class.java)
    }

    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
        on { oneTimeLinkLifeSpan } doReturn Duration.ofSeconds(30)
    }
}