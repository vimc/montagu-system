package org.vaccineimpact.api.blackboxTests

import khttp.options
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.EndpointBuilder
import org.vaccineimpact.api.test_helpers.DatabaseTest

class GeneralSecurityTests : DatabaseTest()
{
    @Test
    fun `can get OPTIONS for secured endpoints`()
    {
        // We just test this for one URL, and assume it is representative
        val exampleURL = EndpointBuilder.build("/diseases/")
        val result = options(exampleURL)
        Assertions.assertThat(result.statusCode).isEqualTo(200)
    }
}