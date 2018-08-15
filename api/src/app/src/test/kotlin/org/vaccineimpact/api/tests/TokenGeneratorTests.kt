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
        sut.getOneTimeLinkToken(OneTimeAction.SET_PASSWORD, parameters, "?redirectUrl=www.redirect.com", "www.redirect.com", "test.user", Duration.ofMinutes(10))

    }
}