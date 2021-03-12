package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.junit.Test
import org.vaccineimpact.api.app.logic.FlowNotifier
import org.vaccineimpact.api.app.logic.HttpClient
import org.vaccineimpact.api.db.ConfigWrapper
import org.vaccineimpact.api.models.BurdenEstimateSetStatus

class FlowNotifierTests
{
    private val disease = "disease-1"
    private val groupId = "group-1"
    private val touchstoneVersionId = "touchstone-1"
    private val scenarioId = "scenario-1"
    private val burdenEstimateSetStatus = BurdenEstimateSetStatus.COMPLETE
    private val responsibilitySetComplete = true

    @Test
    fun `posts correctly formatted Flow message`()
    {
        val mockHttpClient = mock<HttpClient>()
        val mockConfig = mock<ConfigWrapper> {
            on { get("flow.url") } doReturn "http://fake-url.com"
        }
        val sut = FlowNotifier(mockHttpClient, mockConfig)
        sut.notify(groupId, disease, scenarioId, burdenEstimateSetStatus, responsibilitySetComplete,
                touchstoneVersionId)
        verify(mockHttpClient).post("http://fake-url.com",
                emptyMap(),
                mapOf(
                        "groupId" to groupId,
                        "disease" to disease,
                        "scenarioId" to scenarioId,
                        "burdenEstimateSetStatus" to burdenEstimateSetStatus.name,
                        "responsibilitySetComplete" to responsibilitySetComplete,
                        "touchstone" to touchstoneVersionId
                )
        )
    }

    @Test
    fun `errors are caught`()
    {
        val mockHttpClient = mock<HttpClient> {
            on { post(any(), any(), any()) } doThrow Exception("whatever")
        }
        val mockConfig = mock<ConfigWrapper> {
            on { get("flow.url") } doReturn "http://fake-url.com"
        }
        val sut = FlowNotifier(mockHttpClient, mockConfig)
        sut.notify(groupId, disease, scenarioId, burdenEstimateSetStatus, responsibilitySetComplete,
                touchstoneVersionId)
    }

}
