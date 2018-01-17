package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.ErrorHandler
import org.vaccineimpact.api.app.context.OneTimeLinkActionContext
import org.vaccineimpact.api.app.MontaguRedirectValidator
import org.vaccineimpact.api.app.OnetimeLinkResolver
import org.vaccineimpact.api.app.RedirectValidator
import org.vaccineimpact.api.app.controllers.*
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.errors.UnexpectedError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.app.repositories.UserRepository
import org.vaccineimpact.api.models.ResultStatus
import org.vaccineimpact.api.security.WebTokenHelper
import spark.Request

class OneTimeLinkControllerTests : ControllerTests<OneTimeLinkController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = OneTimeLinkController(controllerContext)

    @Test
    fun `fails if token is not in repo`()
    {
        val repo = makeRepository(allowToken = false)
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, basicClaims)
        )
        assertThatThrownBy { controller.onetimeLink(actionContext(), repo) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token cannot be verified`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(false, basicClaims))
        assertThatThrownBy { controller.onetimeLink(actionContext(), makeRepository()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token has wrong subject`()
    {
        val badClaims = mapOf(
                "sub" to "Wrong subject"
        )

        val controller = makeController(
                tokenHelper = makeTokenHelper(true, badClaims))
        assertThatThrownBy { controller.onetimeLink(actionContext(), makeRepository()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `performs action if token is valid`()
    {
        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver>() {
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
        val result = controller.onetimeLink(actionContext(), makeRepository())
        assertThat(result).isEqualTo("OK")
    }

    @Test
    fun `redirects if redirect url query parameter exists`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl)
        )

        val fakeContext = actionContext()
        controller.onetimeLink(fakeContext, makeRepository())
        verify(fakeContext, times(1)).redirect("$redirectUrl?result=successtoken")
    }

    @Test
    fun `does not redirect if redirect url query parameter does not exist`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithoutRedirectUrl)
        )

        val fakeContext = actionContext()
        controller.onetimeLink(fakeContext, makeRepository())
        verify(fakeContext, times(0)).redirect(any())
    }

    @Test
    fun `does not redirect if redirect url query parameter is empty`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(true,
                        claimsWithoutRedirectUrl.plus(mapOf("query" to "redirectUrl=")))
        )

        val fakeContext = actionContext()
        controller.onetimeLink(fakeContext, makeRepository())
        verify(fakeContext, times(0)).redirect(any())
    }

    @Test
    fun `does not redirect if redirect url not valid`()
    {
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                redirectValidator = mock<RedirectValidator> {
                    on { validateRedirectUrl(any()) } doThrow BadRequest("bad request")
                }
        )

        assertThatThrownBy { controller.onetimeLink(actionContext(), makeRepository()) }
                .isInstanceOf(BadRequest::class.java)
    }

    @Test
    fun `redirects on error if redirect url query parameter exists`()
    {
        val mockErrorHandler = mock<ErrorHandler>() {
            on { logExceptionAndReturnMontaguError(any(), any()) } doReturn UnexpectedError.new(Exception())
        }

        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver>() {
            on { perform(any(), any()) } doThrow Exception()
        }

        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                errorHandler = mockErrorHandler,
                onetimeLinkResolver = mockOneTimeLinkResolver
        )

        val fakeContext = actionContext()
        controller.onetimeLink(fakeContext, makeRepository())
        verify(fakeContext, times(1)).redirect("$redirectUrl?result=errortoken")
    }

    @Test
    fun `logs error if redirect url query parameter exists`()
    {
        val mockErrorHandler = mock<ErrorHandler>() {
            on { logExceptionAndReturnMontaguError(any(), any()) } doReturn UnexpectedError.new(Exception())
        }

        val mockOneTimeLinkResolver = mock<OnetimeLinkResolver>() {
            on { perform(any(), any()) } doThrow Exception()
        }
        val controller = makeController(
                tokenHelper = makeTokenHelper(true, claimsWithRedirectUrl),
                errorHandler = mockErrorHandler,
                onetimeLinkResolver = mockOneTimeLinkResolver
        )

        controller.onetimeLink(actionContext(), makeRepository())
        verify(mockErrorHandler, times(1)).logExceptionAndReturnMontaguError(any(), any())
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
            tokenHelper: WebTokenHelper,
            redirectValidator: RedirectValidator = mock(),
            errorHandler: ErrorHandler = mock(),
            onetimeLinkResolver: OnetimeLinkResolver = mock()
    )
            : OneTimeLinkController
    {

        val controllerContext = mockControllerContext(
                webTokenHelper = tokenHelper,
                repositories = mock<Repositories>()
        )

        return OneTimeLinkController(controllerContext,
                errorHandler,
                redirectValidator,
                onetimeLinkResolver)
    }

    private fun makeTokenHelper(allowToken: Boolean, claims: Map<String, Any>): WebTokenHelper
    {
        return mock<WebTokenHelper> {
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