package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.controllers.AbstractController
import org.vaccineimpact.api.app.controllers.ControllerContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.test_helpers.MontaguTests

class AbstractControllerTests : MontaguTests()
{
    private class Controller : AbstractController(ControllerContext("/v6", mock(), mock()))
    {
        override val urlComponent = "/test"
        override fun endpoints(repos: Repositories) = throw NotImplementedError("Not needed for tests")
    }

    @Test
    fun `can build public URL`()
    {
        val c = Controller()
        assertThat(c.buildPublicUrl("/fragment/")).endsWith(
            "/v6/test/fragment/"
        )
    }
}