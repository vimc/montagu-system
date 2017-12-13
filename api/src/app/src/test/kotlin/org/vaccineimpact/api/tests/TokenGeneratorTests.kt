package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.controllers.OneTimeTokenGenerator
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper

class TokenGeneratorTests{

    private fun tokenHelperThatCanGenerateOnetimeTokens() = mock<WebTokenHelper> {
        on { generateOneTimeActionToken(any(), any(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
    }

    // This test is now duplicated in AbstractControllerTests, during our period
    // of overlap between the old and new style controllers. Changes made here should be
    // duplicated until this test is removed.
    @Test
    fun `can get onetime link token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")

        val tokenRepo = mock<TokenRepository>()
        val tokenHelper = tokenHelperThatCanGenerateOnetimeTokens()

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper)
        sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, parameters, null, null, "test.user")

        // Expectations
        verify(tokenHelper).generateOneTimeActionToken("coverage", parameters, null, username = "test.user")
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
        val redirectValidator = mock<RedirectValidator>{
            on (it.validateRedirectUrl(any())) doThrow BadRequest("bad request")
        }

        // Behaviour under test
        val sut = OneTimeTokenGenerator(tokenRepo, tokenHelper, redirectValidator = redirectValidator)

        Assertions.assertThatThrownBy {
            sut.getOneTimeLinkToken(OneTimeAction.COVERAGE, parameters, "", "www.redirect.com", "test.user")
        }.isInstanceOf(BadRequest::class.java)
    }
}