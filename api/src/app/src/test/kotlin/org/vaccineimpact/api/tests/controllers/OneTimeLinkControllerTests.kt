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
import org.vaccineimpact.api.app.repositories.makeRepositories
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.security.WebTokenHelper

class OneTimeLinkControllerTests : ControllerTests<OneTimeLinkController>()
{
    override fun makeController(controllerContext: ControllerContext)
            = OneTimeLinkController(controllerContext, MontaguControllers(controllerContext))

    @Test
    fun `fails if token is not in repo`()
    {
        val repo = makeRepository(allowToken = false)
        val controller = makeController()
        assertThatThrownBy { controller.onetimeLink(actionContext(), repo) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token cannot be verified`()
    {
        val controller = makeController(helperAllowToken = false)
        assertThatThrownBy { controller.onetimeLink(actionContext(), makeRepository()) }
                .isInstanceOf(InvalidOneTimeLinkToken::class.java)
    }

    @Test
    fun `fails if token has wrong subject`()
    {
        val controller = makeController(claims = mapOf(
                "sub" to "Wrong subject"
        ))
        assertThatThrownBy { controller.onetimeLink(actionContext(), makeRepository()) }
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
        controller.onetimeLink(actionContext(), makeRepository())
        verify(otherController).getCoverageData(any<OneTimeLinkActionContext>(), any())
    }

    private fun makeController(
            helperAllowToken: Boolean = true,
            claims: Map<String, Any> = mapOf("sub" to WebTokenHelper.oneTimeActionSubject),
            modellingGroupController: ModellingGroupController? = null
    )
            : OneTimeLinkController
    {
        val helper = makeTokenHelper(allowToken = helperAllowToken, claims = claims)
        val controllerContext = mockControllerContext(webTokenHelper = helper, repositories = makeRepositories())
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

    private fun makeRepository(allowToken: Boolean = true) = mock<TokenRepository> {
        on { it.validateOneTimeToken(any()) } doReturn allowToken
    }

    private fun actionContext() = mock<ActionContext> {
        on { params(":token") } doReturn "TOKEN"
        on { db } doReturn mock<JooqContext>()
    }
}