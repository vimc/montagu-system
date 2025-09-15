package org.vaccineimpact.api.tests.security

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.security.getAllowableTouchstoneStatusList
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.test_helpers.MontaguTests

class CommonSecurityRulesTests : MontaguTests()
{

    @Test
    fun `can get allowable touchstone status list with touchstone prepare permission`()
    {
        //We're testing an extension method so the action context itself can be a mock
        val context = mock<ActionContext>{
            on {this.hasPermission(any())} doReturn true
        }

        val result = context.getAllowableTouchstoneStatusList()
        Assertions.assertThat(result.count()).isEqualTo(3)
        Assertions.assertThat(result.contains(TouchstoneStatus.IN_PREPARATION))
        Assertions.assertThat(result.contains(TouchstoneStatus.OPEN))
        Assertions.assertThat(result.contains(TouchstoneStatus.FINISHED))
    }

    @Test
    fun `can get allowable touchstone status list without touchstone prepare permission`()
    {
        //We're testing an extension method so the action context itself can be a mock
        val context = mock<ActionContext>{
            on {this.hasPermission(any())} doReturn false
        }

        val result = context.getAllowableTouchstoneStatusList()
        Assertions.assertThat(result.count()).isEqualTo(2)
        Assertions.assertThat(result.contains(TouchstoneStatus.OPEN))
        Assertions.assertThat(result.contains(TouchstoneStatus.FINISHED))
    }

}