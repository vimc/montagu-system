package org.vaccineimpact.api.tests.controllers

import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.app_start.Endpoint
import org.vaccineimpact.api.test_helpers.MontaguTests

class EndpointTests : MontaguTests()
{
    @Test
    fun `URL must end in slash`()
    {
        assertThatThrownBy {
            Endpoint("/path/without/terminal/slash", EndpointTests::class, "actionName")
        }.hasMessageContaining("must end with a forward slash")
    }
}