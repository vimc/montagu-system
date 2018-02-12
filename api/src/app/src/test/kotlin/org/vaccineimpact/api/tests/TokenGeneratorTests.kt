package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import java.time.Duration

class TokenGeneratorTests
{

    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOldStyleOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
    }

    // This test is now duplicated in AbstractControllerTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `can get onetime link token for explicit params`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")

        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper)
        sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, parameters, null, null, "test.user", Duration.ofDays(1))

        // Expectations
        verify(tokenHelper).generateOldStyleOneTimeActionToken("coverage", parameters, null, Duration.ofDays(1), "test.user")
        verify(tokenRepo).storeToken("MY-TOKEN")
    }

    // This test is now duplicated in AbstractControllerTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `can get onetime link token for context`()
    {
        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()

        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")

        val context = mock<ActionContext> {
            on { params() } doReturn parameters
            on { username } doReturn "test.user"
        }

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper)
        sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, context)

        // Expectations
        verify(tokenHelper).generateOldStyleOneTimeActionToken("coverage", parameters, null, WebTokenHelper.oneTimeLinkLifeSpan, "test.user")
        verify(tokenRepo).storeToken("MY-TOKEN")
    }

    // This test is now duplicated from AbstractControllerTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `throws error if redirect param is invalid`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")

        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val redirectValidator = mock<RedirectValidator> {
            on(it.validateRedirectUrl(any())) doThrow BadRequest("bad request")
        }

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper, redirectValidator = redirectValidator)

        Assertions.assertThatThrownBy {
            sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, parameters, "?redirectUrl=www.redirect.com", "www.redirect.com", "test.user", Duration.ofMinutes(10))
        }.isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `generates token if redirect param is valid`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")

        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()
        val redirectValidator = mock<RedirectValidator>()

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper, redirectValidator = redirectValidator)
        sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, parameters, "?redirectUrl=www.redirect.com", "www.redirect.com", "test.user", Duration.ofMinutes(10))

    }
}