package org.vaccineimpact.api.tests.filters

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
import org.vaccineimpact.api.test_helpers.MontaguTests

class FilterParameterTests : MontaguTests()
{
    @Test
    fun `can extract scenario filter parameters from URL`()
    {
        val context = mock<ActionContext> {
            on { queryParams("scenario_id") } doReturn "scenario_17"
            on { queryParams("disease") } doReturn "common_cold"
        }
        val params = ScenarioFilterParameters.fromContext(context)
        assertThat(params).isEqualTo(ScenarioFilterParameters(
                scenarioId = "scenario_17",
                disease = "common_cold"
        ))
    }
}