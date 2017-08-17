package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.junit.Test
import org.vaccineimpact.api.OneTimeAction
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.app.repositories.TokenRepository
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

abstract class ControllerTests<out TController : AbstractController> : MontaguTests()
{
    protected fun mockControllerContext(
            repositories: Repositories? = null,
            webTokenHelper: WebTokenHelper? = null
    )
            : ControllerContext
    {
        return mock {
            on { urlBase } doReturn "/v1"
            if (repositories != null)
            {
                on { this.repositories } doReturn repositories
            }
            if (webTokenHelper != null)
            {
                on { tokenHelper } doReturn webTokenHelper
            }
        }
    }

    protected abstract fun makeController(controllerContext: ControllerContext): TController

}