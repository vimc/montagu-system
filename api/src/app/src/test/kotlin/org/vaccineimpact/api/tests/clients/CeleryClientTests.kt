package org.vaccineimpact.api.tests.clients

import com.github.fge.jackson.JsonLoader
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.clients.CeleryClient
import org.vaccineimpact.api.app.logic.KHttpClient
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.db.Config
import org.vaccineimpact.api.models.helpers.ContentTypes

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
        val taskId = JsonLoader.fromString(response.text)["task-id"].asText()

        // Poll the task id to make sure it completes
        val httpClient = KHttpClient()
        val flowerHost= Config["celery.flower.host"]
        val flowerPort = Config["celery.flower.port"]
        val statusUrl = "http://$flowerHost:$flowerPort/api/task/result/$taskId"

        var success = false
        var tries = 0
        while ((!success) && (tries < 60))
        {
            val taskResponse = httpClient.get(statusUrl, mapOf("Content-type" to ContentTypes.json))
            val responseJson = JsonLoader.fromString(taskResponse.text)
            val state = responseJson["state"].asText()
            if (state == "SUCCESS")
            {
                success = true

                val result = responseJson["result"]
                val version = result.fieldNames().next() // expect one version
                assertThat(result[version]["published"].asBoolean()).isTrue()

                break
            }
            tries++
            Thread.sleep(1000)
        }
        assertThat(success).isTrue()
    }
}
