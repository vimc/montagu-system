package org.vaccineimpact.api.tests

import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.app_start.Controller
import org.vaccineimpact.api.app.app_start.ControllerFactory
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.repositories.Repositories
import org.vaccineimpact.api.security.WebTokenHelper
import org.vaccineimpact.api.test_helpers.MontaguTests

class ControllerFactoryTests : MontaguTests()
{
    @Test
    fun `can instantiate controller with two parameter constructor`()
    {
        class Controller2(context: ActionContext, repositories: Repositories) : Controller(context)

        val factory = ControllerFactory(mock(), mock(), mock())
        assertThat(factory.instantiateController(Controller2::class)).isInstanceOf(Controller2::class.java)
    }

    @Test
    fun `can instantiate controller with three parameter constructor`()
    {
        class Controller3(context: ActionContext, repositories: Repositories, webTokenHelper: WebTokenHelper)
            : Controller(context)

        val factory = ControllerFactory(mock(), mock(), mock())
        assertThat(factory.instantiateController(Controller3::class)).isInstanceOf(Controller3::class.java)
    }

    @Test
    fun `given the choice uses three parameter constructor`()
    {
        val helper1 = mock<WebTokenHelper>()
        val helper2 = mock<WebTokenHelper>()

        // If the 2 argument constructor is called, the WebTokenHelper will end up being equal to helper1,
        // whereas if the 3 argument constructor is called it will be helper2
        class Controller2and3(
                context: ActionContext,
                val repositories: Repositories,
                val webTokenHelper: WebTokenHelper
        ): Controller(context)
        {
            constructor(actionContext: ActionContext, repositories: Repositories)
                : this(actionContext, repositories, helper1)
        }
        val factory = ControllerFactory(mock(), mock(), helper2)

        val controller = factory.instantiateController(Controller2and3::class)
        assertThat(controller).isInstanceOf(Controller2and3::class.java)
        assertThat((controller as Controller2and3).webTokenHelper).isEqualTo(helper2)
    }

    @Test
    fun `throws exception if there is no matching constructor`()
    {
        class BadController
        assertThatThrownBy {
            ControllerFactory(mock(), mock(), mock()).instantiateController(BadController::class)
        }
    }
}