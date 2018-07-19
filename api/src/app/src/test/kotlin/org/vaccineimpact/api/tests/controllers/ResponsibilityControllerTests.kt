package org.vaccineimpact.api.tests.controllers

import com.nhaarman.mockito_kotlin.*
import com.opencsv.CSVReader
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.controllers.GroupResponsibilityController
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.permissions.ReifiedPermission
import org.vaccineimpact.api.models.responsibilities.*
import org.vaccineimpact.api.serialization.MontaguSerializer
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleExpectations
import java.io.BufferedOutputStream
import java.io.FileOutputStream
import java.io.OutputStream
import java.io.StringReader
import java.math.BigDecimal

class ResponsibilityControllerTests : MontaguTests()
{
    @Test
    fun `returns in preparation touchstones & touchstone versions if user has permission to read in-prep touchstones`()
    {
        val groupId = "test-group"
        val repo = mock<ModellingGroupRepository> {
            on { getTouchstonesByGroupId(groupId) } doReturn mockTouchstones
        }

        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { hasPermission(ReifiedPermission.parse("*/touchstones.prepare")) } doReturn true
        }
        val data = GroupResponsibilityController(context, repo, mock(), mock()).getResponsibleTouchstones()
        assertThat(data).isEqualTo(mockTouchstones)
    }

    @Test
    fun `does not return in preparation touchstones & touchstone versions if user lacks permissions`()
    {
        val groupId = "test-group"
        val repo = mock<ModellingGroupRepository> {
            on { getTouchstonesByGroupId(groupId) } doReturn mockTouchstones
        }

        val context = mock<ActionContext> {
            on { params(":group-id") } doReturn groupId
            on { hasPermission(ReifiedPermission.parse("*/touchstones.prepare")) } doReturn false
        }
        val data = GroupResponsibilityController(context, repo, mock(), mock()).getResponsibleTouchstones()
        // Note that here we are testing both that the touchstone named 'touchstone' only has 1
        // of its versions returned, and that the 'all-hidden' touchstone isn't returned at all
        assertThat(data).isEqualTo(listOf(
                Touchstone("touchstone", "description", "comment", listOf(
                        TouchstoneVersion("touchstone-1", "touchstone", 1, "open", TouchstoneStatus.OPEN)
                ))
        ))
    }

    @Test
    fun `getResponsibilities gets parameters from URL`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.FINISHED
        )
        val repo = mock<ResponsibilitiesRepository> {
            on { getResponsibilitiesForGroupAndTouchstone(any(), any(), any()) } doReturn data
        }
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn true
        }

        GroupResponsibilityController(context, mock(), repo, mock()).getResponsibilities()

        verify(repo).getResponsibilitiesForGroupAndTouchstone(eq("gId"), eq("tId"), any())
    }

    @Test
    fun `getResponsibilities returns error if user does not have permission to see in-preparation touchstone`()
    {
        val data = ResponsibilitiesAndTouchstoneStatus(
                Responsibilities("tId", "", null, emptyList()),
                TouchstoneStatus.IN_PREPARATION
        )
        val repo = mock<ResponsibilitiesRepository> {
            on { getResponsibilitiesForGroupAndTouchstone(any(), any(), any()) } doReturn data
        }
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn false
        }

        Assertions.assertThatThrownBy {
            GroupResponsibilityController(context, mock(), repo, mock()).getResponsibilities()
        }.hasMessageContaining("Unknown touchstone-version")
    }

    @Test
    fun `getResponsibilities checks modelling group exists`()
    {
        val repo = mock<ModellingGroupRepository> {
            on { getModellingGroup(any()) } doThrow UnknownObjectError("badId", "ModellingGroup")
        }
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "badId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { hasPermission(any()) } doReturn true
        }

        Assertions.assertThatThrownBy {
            GroupResponsibilityController(context, repo, mock(), mock()).getResponsibilities()
        }.hasMessageContaining("Unknown modelling-group")
    }

    @Test
    fun `getResponsibility gets parameters from URL`()
    {
        val logic = makeLogicMockingGetResponsibilityWithExpectations(TouchstoneStatus.OPEN)
        val context = mockContextForSpecificResponsibility(true)
        GroupResponsibilityController(context, mock(), mock(), logic).getResponsibility()
        verify(logic).getResponsibilityWithExpectations(eq("gId"), eq("tId"), eq("sId"))
    }

    @Test
    fun `getResponsibility returns error if user does not have permission to see in-preparation touchstone`()
    {
        val logic = makeLogicMockingGetResponsibilityWithExpectations(TouchstoneStatus.IN_PREPARATION)
        val context = mockContextForSpecificResponsibility(false)
        Assertions.assertThatThrownBy {
            GroupResponsibilityController(context, mock(), mock(), logic).getResponsibility()
        }.hasMessageContaining("Unknown touchstone-version")
    }

    @Test
    fun `getResponsibility checks modelling group exists`()
    {
        val repo = mock<ModellingGroupRepository> {
            on { getModellingGroup(any()) } doThrow UnknownObjectError("badId", "ModellingGroup")
        }
        val context = mockContextForSpecificResponsibility(true)

        Assertions.assertThatThrownBy {
            GroupResponsibilityController(context, repo, mock(), mock()).getResponsibility()
        }.hasMessageContaining("Unknown modelling-group")

    }

    @Test
    fun `can get template`()
    {
        val context = mockContextForSpecificResponsibility(true)

        val repo = mock<ExpectationsLogic> {
            on { getExpectationsForResponsibility(any(), any(), any()) } doReturn Expectations(2000..2030, 1..10, CohortRestriction(null, null),
                    listOf(Country("ABC", "CountryA"), Country("DEF", "CountryD")), listOf("Dalys", "Deaths"))
        }

        GroupResponsibilityController(context, mock(), mock(), repo)
                .getTemplate()
    }

    private val mockTouchstones = listOf(
            Touchstone("touchstone", "description", "comment", listOf(
                    TouchstoneVersion("touchstone-1", "touchstone", 1, "open", TouchstoneStatus.OPEN),
                    TouchstoneVersion("touchstone-bad", "touchstone", 1, "not open", TouchstoneStatus.IN_PREPARATION)
            )),
            Touchstone("all-hidden", "All versions of this touchstone are in prep", "comment", listOf(
                    TouchstoneVersion("all-hidden-1", "all-hidden", 1, "hidden", TouchstoneStatus.IN_PREPARATION)
            ))
    )

    private fun mockContextForSpecificResponsibility(hasPermissions: Boolean): ActionContext
    {
        val context = mock<ActionContext> {
            on { it.params(":group-id") } doReturn "gId"
            on { it.params(":touchstone-version-id") } doReturn "tId"
            on { it.params(":scenario-id") } doReturn "sId"
            on { hasPermission(any()) } doReturn hasPermissions
        }
        return context
    }

    private fun makeLogicMockingGetResponsibilityWithExpectations(status: TouchstoneStatus): ExpectationsLogic
    {
        return mock {
            on { getResponsibilityWithExpectations(any(), any(), any()) } doReturn ResponsibilityDetails(
                    Responsibility(
                            Scenario("sId", "scDesc", "disease", listOf("t-1")),
                            ResponsibilityStatus.EMPTY, emptyList(), null
                    ),
                    TouchstoneVersion("tId", "t", 1, "desc", status),
                    exampleExpectations()
            )
        }
    }
}