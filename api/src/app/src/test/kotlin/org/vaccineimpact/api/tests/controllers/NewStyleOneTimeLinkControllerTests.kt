package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.NewStyleOneTimeLinkController
import org.vaccineimpact.api.app.controllers.OneTimeTokenGenerator
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Duration

class NewStyleOneTimeLinkControllerTests : MontaguTests()
{
    @Test
    fun `can get onetime demographic data token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
            on { username } doReturn "test.user"
        }
        val tokenRepo = mock<TokenRepository>()
        val tokenGenerator = tokenGenerator()

        // Behaviour under test
        val controller = NewStyleOneTimeLinkController(context, tokenGenerator)
        controller.getTokenForDemographicData()

        // Expectations
        verify(tokenGenerator).getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY, parameters, null,
                username = "test.user", duration = Duration.ofMinutes(10), redirectUrl = null)
    }

    private fun tokenGenerator() = mock<OneTimeTokenGenerator> {
        on { getOneTimeLinkToken(any(), any(), anyOrNull(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
    }
}