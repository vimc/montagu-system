package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.ActionContext
import org.vaccineimpact.api.app.controllers.TouchstoneController
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.Touchstone
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.YearRange
import org.vaccineimpact.api.test_helpers.MontaguTests

class TouchstoneControllerTests : MontaguTests()
{
    @Test
    fun `getTouchstones returns touchstones`()
    {
        val data = listOf(
                Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.OPEN)
        )
        val dataSet = mock<SimpleDataSet<Touchstone, String>> {
            on { all() } doReturn data
        }
        val repo = mock<TouchstoneRepository> {
            on { touchstones } doReturn dataSet
        }
        val context = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }

        val controller = TouchstoneController({ repo })
        controller.getTouchstones(context)

        verify(dataSet).all()
    }

    @Test
    fun `getTouchstones filters out in-preparation touchstones if the user doesn't have the permissions`()
    {
        val data = listOf(
                Touchstone("t-1", "t", 1, "description", YearRange(2000, 2010), TouchstoneStatus.OPEN),
                Touchstone("t-2", "t", 2, "description", YearRange(2000, 2010), TouchstoneStatus.IN_PREPARATION)
        )
        val dataSet = mock<SimpleDataSet<Touchstone, String>> {
            on { all() } doReturn data
        }
        val repo = mock<TouchstoneRepository> {
            on { touchstones } doReturn dataSet
        }
        val controller = TouchstoneController({ repo })

        val permissiveContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn true
        }
        assertThat(controller.getTouchstones(permissiveContext)).hasSize(2)

        val limitedContext = mock<ActionContext> {
            on { hasPermission(any()) } doReturn false
        }
        assertThat(controller.getTouchstones(limitedContext)).hasSize(1)
    }

    @Test
    fun `getScenarios filter parameters from URL`()
    {
        TODO()
    }
}
