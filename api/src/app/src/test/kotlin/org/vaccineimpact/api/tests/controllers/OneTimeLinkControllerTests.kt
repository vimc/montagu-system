package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ErrorHandler
import org.vaccineimpact.api.app.OnetimeLinkResolver
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.models.helpers.OneTimeAction
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests
import spark.Request

class OneTimeLinkControllerTests : MontaguTests()
{
    @Test
    fun `fails if token is not in repo`()
    {
        val repo = makeRepository(allowToken = false)
        val controller = makeController(
                repo = repo,
                tokenHelper = makeTokenHelper(true, basicClaims)
        )
        assertThatThrownBy { controller.onetimeLink() }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token cannot be verified`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(false, basicClaims)
        )
        assertThatThrownBy { controller.onetimeLink() }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token has wrong subject`()
    {
        val badClaims = mapOf(
                "sub" to "Wrong subject"
        )

        val controller = makeController(
                tokenHelper = makeTokenHelper(true, badClaims)
        )
        assertThatThrownBy {
            controller.onetimeLink()
        }.isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `performs action if token is valid`()
    {
        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver> {
            on { perform(any(), any()) } doReturn "OK"
        }
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, mapOf(
                        "sub" to WebTokenHelper.oneTimeActionSubject,
                        "action" to "coverage",
                        "payload" to ":username=test.user"
                )),
                onetimeLinkResolver = mockOneTimeLinkResolver
        )
        val result = controller.onetimeLink()
        assertThat(result).isEqualTo("OK")
    }

    @Test
    fun `redirects if redirect url query parameter exists`()
    {
        val fakeContext = actionContext()
        val controller = makeController(
                context = fakeContext,
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl)
        )
        controller.onetimeLink()
        verify(fakeContext, times(1)).redirect("$redirectUrl?result=successtoken")
    }

    @Test
    fun `does not redirect if redirect url query parameter does not exist`()
    {
        val fakeContext = actionContext()
        val controller = makeController(
                context = fakeContext,
                tokenHelper = makeTokenHelper(true, claimsWithoutRedirectUrl)
        )
        controller.onetimeLink()
        verify(fakeContext, times(0)).redirect(any())
    }

    @Test
    fun `does not redirect if redirect url query parameter is empty`()
    {
        val tokenHelper = makeTokenHelper(
                true,
                claimsWithoutRedirectUrl.plus(mapOf("query" to "redirectUrl="))
        )
        val fakeContext = actionContext()
        val controller = makeController(
                context = fakeContext,
                tokenHelper = tokenHelper
        )
        controller.onetimeLink()
        verify(fakeContext, times(0)).redirect(any())
    }

    @Test
    fun `does not redirect if redirect url not valid`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                redirectValidator = mock {
                    on { validateRedirectUrl(any()) } doThrow BadRequest("bad request")
                }
        )
        assertThatThrownBy {
            controller.onetimeLink()
        }.isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `redirects on error if redirect url query parameter exists`()
    {
        val mockErrorHandler = mock<ErrorHandler> {
            on { logExceptionAndReturnMontaguError(any(), any()) } doReturn UnexpectedError.new(Exception())
        }
        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver> {
            on { perform(any(), any()) } doThrow Exception()
        }
        val fakeContext = actionContext()

        val controller = makeController(
                context = fakeContext,
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                errorHandler = mockErrorHandler,
                onetimeLinkResolver = mockOneTimeLinkResolver
        )
        controller.onetimeLink()
        verify(fakeContext, times(1)).redirect("$redirectUrl?result=errortoken")
    }

    @Test
    fun `rethrows error if redirect url query parameter is longer than 1900 chars`()
    {
        val longMessage = org.apache.commons.lang3.StringUtils.repeat('a', 1901)
        val tokenHelper = mock<WebTokenHelper> {
            on(it.encodeResult(argThat { status == ResultStatus.FAILURE })) doReturn longMessage
            on (it.verify(any())) doReturn claimsWithRedirectUrl
        }
        val mockErrorHandler = mock<ErrorHandler> {
            on { logExceptionAndReturnMontaguError(any(), any()) } doReturn
                    UnexpectedError.new(Exception(longMessage))
        }
        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver> {
            on { perform(any(), any()) } doThrow Exception()
        }
        val fakeContext = actionContext()

        val controller = makeController(
                context = fakeContext,
                tokenHelper = tokenHelper,
                errorHandler = mockErrorHandler,
                onetimeLinkResolver = mockOneTimeLinkResolver
        )

        assertThatThrownBy { controller.onetimeLink() }
    }

    @Test
    fun `logs error if redirect url query parameter exists`()
    {
        val mockErrorHandler = mock<ErrorHandler> {
            on { logExceptionAndReturnMontaguError(any(), any()) } doReturn UnexpectedError.new(Exception())
        }

        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver> {
            on { perform(any(), any()) } doThrow Exception()
        }
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                errorHandler = mockErrorHandler,
                onetimeLinkResolver = mockOneTimeLinkResolver
        )
        controller.onetimeLink()
        verify(mockErrorHandler, times(1)).logExceptionAndReturnMontaguError(any(), any())
    }

    @Test
    fun `can get onetime demographic data token`()
    {
        // Mocks
        val parameters = mapOf(":a" to "1", ":b" to "2")
        val context = mock<ActionContext> {
            on { params() } doReturn parameters
            on { username } doReturn "test.user"
        }
        val tokenGenerator = tokenGenerator()

        // Behaviour under test
        val controller = makeController(
                context = context,
                oneTimeTokenGenerator = tokenGenerator
        )
        controller.getTokenForDemographicData()

        // Expectations
        verify(tokenGenerator).getOneTimeLinkToken(OneTimeAction.DEMOGRAPHY, context)
    }

    private fun tokenGenerator() = mock<OneTimeTokenGenerator> {
        on { getOneTimeLinkToken(any(), any(), anyOrNull(), anyOrNull(), any(), any()) } doReturn "MY-TOKEN"
    }

    private val basicClaims = mapOf("sub" to WebTokenHelper.oneTimeActionSubject, "username" to "test.user")

    private val redirectUrl = "https://localhost"

    private val claimsWithRedirectUrl =
            mapOf(
                    "sub" to WebTokenHelper.oneTimeActionSubject,
                    "action" to "burdens-create",
                    "payload" to ":username=test.user",
                    "query" to "redirectUrl=$redirectUrl",
                    "username" to "test.user"
            )

    private val claimsWithoutRedirectUrl =
            mapOf(
                    "sub" to WebTokenHelper.oneTimeActionSubject,
                    "action" to "burdens-create",
                    "payload" to ":username=test.user",
                    "username" to "test.user"
            )

    private fun makeController(
            context: ActionContext = actionContext(),
            repo: TokenRepository = makeRepository(),
            tokenHelper: WebTokenHelper = mock(),
            oneTimeTokenGenerator: OneTimeTokenGenerator = mock(),
            redirectValidator: RedirectValidator = mock(),
            errorHandler: ErrorHandler = mock(),
            onetimeLinkResolver: OnetimeLinkResolver = mock()
    )
            : OneTimeLinkController
    {
        return OneTimeLinkController(
                context,
                repo,
                oneTimeTokenGenerator,
                onetimeLinkResolver,
                tokenHelper,
                errorHandler,
                redirectValidator)
    }

    private fun makeTokenHelper(allowToken: Boolean, claims: Map<String, Any>): WebTokenHelper
    {
        return mock {
            on(it.encodeResult(argThat { status == ResultStatus.FAILURE })) doReturn "errortoken"
            on(it.encodeResult(argThat { status == ResultStatus.SUCCESS })) doReturn "successtoken"
            if (allowToken)
            {
                on(it.verify(any())) doReturn claims
            }
            else
            {
                on(it.verify(any())) doThrow RuntimeException("X")
            }
        }
    }

    private fun makeRepository(allowToken: Boolean = true) = mock<TokenRepository> {
        on { it.validateOneTimeToken(any()) } doReturn allowToken
    }

    private fun actionContext() = mock<ActionContext> {
        on { params(":token") } doReturn "TOKEN"
        on { request } doReturn mock<Request>()
    }
}