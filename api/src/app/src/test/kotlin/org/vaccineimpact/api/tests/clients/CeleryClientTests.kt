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
        val task = client.runDiagnosticReport("testGroup", "testDisease", "testTouchstone",
                "test.user@example.com")

        val result = task.get().mapValues { DiagnosticReportTaskResult(it.value["published"] ?: false) }
        assertThat(result.count()).isEqualTo(1)
        assertThat(result.entries.first().value.published).isTrue()
    }
}

data class DiagnosticReportTaskResult(val published: Boolean)
