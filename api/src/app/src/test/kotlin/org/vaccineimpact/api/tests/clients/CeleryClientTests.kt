package org.vaccineimpact.api.tests.clients

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.clients.CeleryClient
import org.vaccineimpact.api.test_helpers.MontaguTests

// You must have the database, orderly-web, task-queue and api running for this test suite
// to pass.
// :startDatabase
// :startTestAPI
// :startOrderlyWeb
// :startTaskQueue
class CeleryClientTests : MontaguTests()
{
    @Test
    fun `can call task`()
    {
        val client = CeleryClient()
        val response = client.runDiagnosticReport("testGroup", "testDisease", "testTouchstone",
                "testScenario",
                "test.user@example.com")

        assertThat(response.statusCode).isEqualTo(200)
    }
}
