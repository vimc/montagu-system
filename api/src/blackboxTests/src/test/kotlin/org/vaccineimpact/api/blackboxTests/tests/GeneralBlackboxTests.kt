package org.vaccineimpact.api.blackboxTests.tests

import khttp.options
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.blackboxTests.helpers.EndpointBuilder
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.validateSchema.JSONValidator

class GeneralBlackboxTests : DatabaseTest()
{
    @Test
    fun `unknown URL returns 404`()
    {
        val helper = RequestHelper()
        val response = helper.get("/fake/url")
        assertThat(response.statusCode).isEqualTo(404)
        JSONValidator().validateError(response.text,
                expectedErrorCode = "unknown-resource",
                expectedErrorText = "Unknown resource. Please check the URL"
        )
    }

    @Test
    fun `can get OPTIONS for secured endpoints`()
    {
        // We just test this for one URL, and assume it is representative
        val exampleURL = EndpointBuilder.build("/diseases/")
        val result = options(exampleURL)
        Assertions.assertThat(result.statusCode).isEqualTo(200)
    }
}