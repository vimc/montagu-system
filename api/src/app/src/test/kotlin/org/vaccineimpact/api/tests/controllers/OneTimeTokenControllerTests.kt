package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.pac4j.core.profile.CommonProfile
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.OneTimeTokenController
import org.vaccineimpact.api.app.errors.MissingRequiredParameterError
import org.vaccineimpact.api.app.security.OneTimeTokenGenerator
import org.vaccineimpact.api.test_helpers.MontaguTests

class OneTimeTokenControllerTests: MontaguTests(){

    @Test
    fun `can get new style token`()
    {
        val profile = mock<CommonProfile>()
        val context = mock<ActionContext> {
            on { queryParams("url") } doReturn "/some/url/"
            on { userProfile } doReturn profile
        }
        val generator = mock<OneTimeTokenGenerator> {
            on { getOneTimeLinkToken(any(), any()) } doReturn "TOKEN"
        }
        val controller = OneTimeTokenController(context, generator)
        assertThat(controller.getToken()).isEqualTo("TOKEN")
        verify(generator).getOneTimeLinkToken("/some/url/", profile)
    }

    @Test
    fun `error is thrown if url is not provided when getting new style token`()
    {
        val context = mock<ActionContext> {
            on { queryParams("url") } doReturn (null as String?)
        }
        val controller = OneTimeTokenController(context, mock<OneTimeTokenGenerator>())
        assertThatThrownBy {
            controller.getToken()
        }.isInstanceOf(MissingRequiredParameterError::class.java)
    }
}