package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.endpoints.basicEndpoint
import org.vaccineimpact.api.test_helpers.MontaguTests

class EndpointTests : MontaguTests()
{
    @Test
    fun `URL must end in slash`()
    {
        val handler: (context: ActionContext) -> Any = { _ -> print("Hello world ") }
        assertThatThrownBy({ basicEndpoint("/path/without/terminal/slash", handler) })
                .hasMessageContaining("must end with a forward slash")
    }
}