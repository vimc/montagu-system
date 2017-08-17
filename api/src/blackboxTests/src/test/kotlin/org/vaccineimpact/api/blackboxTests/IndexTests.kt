package org.vaccineimpact.api.blackboxTests

import org.junit.Test
import org.vaccineimpact.api.blackboxTests.schemas.JSONSchema
import org.vaccineimpact.api.blackboxTests.helpers.RequestHelper
import org.vaccineimpact.api.test_helpers.DatabaseTest
import org.vaccineimpact.api.test_helpers.MontaguTests

class IndexTests : DatabaseTest()
{
    @Test
    fun `can read index`()
    {
        val response = RequestHelper().get("/")
        JSONSchema("Index").validateResponse(response.text, response.headers["Content-Type"])
    }
}