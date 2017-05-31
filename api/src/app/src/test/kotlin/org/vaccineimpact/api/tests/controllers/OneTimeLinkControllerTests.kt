package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.OneTimeLinkActionContext
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.controllers.ModellingGroupController
import org.vaccineimpact.api.app.controllers.MontaguControllers
import org.vaccineimpact.api.app.controllers.OneTimeLinkController
import org.vaccineimpact.api.app.errors.InvalidOneTimeLinkToken
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.security.WebTokenHelper

class OneTimeLinkControllerTests : ControllerTests<OneTimeLinkController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = OneTimeLinkController(controllerContext, MontaguControllers(controllerContext))

    @Test
    fun `fails if token is not in repo`()
    {
        val controller = makeController(repoAllowToken = false)
        assertThatThrownBy { controller.onetimeLink(actionContext()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token cannot be verified`()
    {
        val controller = makeController(helperAllowToken = false)
        assertThatThrownBy { controller.onetimeLink(actionContext()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token has wrong subject`()
    {
        val controller = makeController(claims = mapOf(
                "sub" to "Wrong subject"
        ))
        assertThatThrownBy { controller.onetimeLink(actionContext()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `performs action if token is valid`()
    {
        val otherController = mock<ModellingGroupController>()
        val controller = makeController(
                modellingGroupController = otherController,
                claims = mapOf(
                        "sub" to WebTokenHelper.oneTimeActionSubject,
                        "action" to "coverage",
                        "payload" to ":group-id=gId&:touchstone-id=tId&:scenario-id=sId"
                )
        )
        controller.onetimeLink(actionContext())
        verify(otherController).getCoverageData(any<OneTimeLinkActionContext>())
    }

    private fun makeController(
            repoAllowToken: Boolean = true,
            helperAllowToken: Boolean = true,
            claims: Map<String, Any> = mapOf("sub" to WebTokenHelper.oneTimeActionSubject),
            modellingGroupController: ModellingGroupController? = null
    )
            : OneTimeLinkController
    {
        val repo = makeRepository(allowToken = repoAllowToken)
        val helper = makeTokenHelper(allowToken = helperAllowToken, claims = claims)
        val controllerContext = mockControllerContext(
                RepositoryMock({ it.token }, repo),
                webTokenHelper = helper
        )
        val otherController = modellingGroupController ?: mock<ModellingGroupController>()
        val otherControllers = mock<MontaguControllers> {
            on { modellingGroup } doReturn otherController
        }
        return OneTimeLinkController(controllerContext, otherControllers)
    }

    private fun makeTokenHelper(allowToken: Boolean, claims: Map<String, Any>): WebTokenHelper
    {
        return if (allowToken)
        {
            mock { on { verify(any()) } doReturn claims }
        }
        else
        {
            mock { on { verify(any()) } doThrow RuntimeException("X") }
        }
    }

    private fun makeRepository(allowToken: Boolean) = mock<TokenRepository> {
        on { it.validateOneTimeToken(any()) } doReturn allowToken
    }

    private fun actionContext() = mock<ActionContext> {
        on { params(":token") } doReturn "TOKEN"
    }
}