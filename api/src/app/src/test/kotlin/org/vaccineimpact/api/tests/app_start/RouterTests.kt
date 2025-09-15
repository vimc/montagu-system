package org.vaccineimpact.api.tests.app_start

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.app.app_start.Router
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.test_helpers.MontaguTests

class RouterTests : MontaguTests()
{
    @Test
    fun `router can invoke action`()
    {
        TestController.invoked = false
        val router = Router(mock(), mock(), mock(), mock())
        router.invokeControllerAction(Endpoint("/", TestController::class, "test"), mock(), mock())
        assertThat(TestController.invoked).isTrue()
    }

    class TestController(
            context: ActionContext,
            @Suppress("UNUSED_PARAMETER") repositories: Repositories
    ) : Controller(context)
    {
        fun test()
        {
            invoked = true
        }

        companion object
        {
            var invoked = false
        }
    }
}