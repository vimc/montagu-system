package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesResponsibilitiesLogic
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class ResponsibilitiesLogicTests : MontaguTests()
{
    private val groupId = "group-1"
    private val touchstoneVersionId = "touchstone-1"
    private val scenarioId = "scenario-1"

    @Test
    fun `can validate Responsibility Path`()
    {
        val path = ResponsibilityPath(groupId, touchstoneVersionId, scenarioId)

        val statusList = mutableListOf(TouchstoneStatus.OPEN, TouchstoneStatus.FINISHED)

        val groupRepo = mock<ModellingGroupRepository>()

        val touchstoneVersion = TouchstoneVersion(touchstoneVersionId, "touchstone", 1,
                "description", TouchstoneStatus.OPEN)

        val mockTouchstoneVersions = mock<SimpleDataSet<TouchstoneVersion, String>> {
            on { get(touchstoneVersionId) } doReturn touchstoneVersion
        }

        val scenarioRepo = mock<ScenarioRepository>()

        val touchstoneRepo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn mockTouchstoneVersions
        }

        val sut = RepositoriesResponsibilitiesLogic(groupRepo, scenarioRepo, touchstoneRepo, mock())

        sut.validateResponsibilityPath(path, statusList)

        verify(groupRepo).getModellingGroup(groupId)
        verify(touchstoneRepo).touchstoneVersions
        verify(mockTouchstoneVersions).get(touchstoneVersionId)
        verify(scenarioRepo).checkScenarioDescriptionExists(scenarioId)
    }

    @Test
    fun `throws UnknownObjectError when validating Responsibility Path if touchstone status is not in allowable list`()
    {
        val path = ResponsibilityPath(groupId, touchstoneVersionId, scenarioId)

        val statusList = mutableListOf(TouchstoneStatus.OPEN, TouchstoneStatus.FINISHED)

        val touchstoneVersion = TouchstoneVersion(touchstoneVersionId, "touchstone", 1,
                "description", TouchstoneStatus.IN_PREPARATION)

        val mockTouchstoneVersions = mock<SimpleDataSet<TouchstoneVersion, String>> {
            on { get(touchstoneVersionId) } doReturn touchstoneVersion
        }

        val touchstoneRepo = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn mockTouchstoneVersions
        }

        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), touchstoneRepo, mock())

        Assertions.assertThatThrownBy {
            sut.validateResponsibilityPath(path, statusList)
        }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining("Unknown touchstone-version with id 'touchstone-1'")

    }

    @Test
    fun `can get data`()
    {
        val now = Instant.now()
        val then = now.minusMillis(1)
        val responsibilitiesRepo = mock<ResponsibilitiesRepository> {
            on { getResponsibilitiesWithCommentsForTouchstone("202002rfp-1") } doReturn listOf(
                    ResponsibilitySetWithComments("202002rfp-1", "VIMC", ResponsibilityComment("Note for VIMC for 202002rfp-1", "test.user", now), listOf(
                            ResponsibilityWithComment("scenario-1", ResponsibilityComment("Note for VIMC, Campaign, Cholera for 202002rfp-1", "test.user2", then))
                    ))
            )
            // Declare that this touchstone has a single responsibility set containing a single responsibility, and that it has had a burden estimate set uploaded
            on { getResponsibilitiesForTouchstone("202002rfp-1") } doReturn listOf(
                    ResponsibilitySet("202002rfp-1", "VIMC", ResponsibilitySetStatus.INCOMPLETE, listOf(
                            Responsibility(
                                    Scenario("scenario-1", "Default - Campaign", "Cholera", listOf("202002rfp")),
                                    ResponsibilityStatus.EMPTY,
                                    emptyList(),
                                    BurdenEstimateSet(
                                            1,
                                            now,
                                            "test.user",
                                            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, "time varying CFR"),
                                            BurdenEstimateSetStatus.PARTIAL,
                                            listOf("Data is corrupt", "Results are meaningless"),
                                            null
                                    )
                            )
                    ))
            )
        }
        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), mock(), responsibilitiesRepo)
        val result = sut.getTouchstoneResponsibilitiesData("202002rfp-1")
        assertThat(result).isEqualTo(listOf(
                ResponsibilityRow(
                        "202002rfp-1",
                        "VIMC",
                        1,
                        "Note for VIMC for 202002rfp-1",
                        now,
                        "test.user",
                        "Default - Campaign",
                        "Cholera",
                        1,
                        now,
                        "test.user",
                        BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN,
                        "time varying CFR",
                        BurdenEstimateSetStatus.PARTIAL,
                        "Data is corrupt, Results are meaningless",
                        "Note for VIMC, Campaign, Cholera for 202002rfp-1",
                        then,
                        "test.user2"
                )
        ))
    }

}
