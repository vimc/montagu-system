package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.controllers.EndpointDefinition
import org.vaccineimpact.api.tests.MontaguTests

class EndpointTests : MontaguTests()
{
    @Test
    fun `URL must end in slash`()
    {
        val handler: (spark.Request, spark.Response) -> Any = { req, res -> print("Hello world ") }
        assertThatThrownBy({ EndpointDefinition("/path/without/terminal/slash", handler) })
                .hasMessageContaining("must end with a forward slash")
    }
}