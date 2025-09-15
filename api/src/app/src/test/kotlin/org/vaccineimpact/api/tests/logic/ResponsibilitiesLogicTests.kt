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

        val sut = RepositoriesResponsibilitiesLogic(groupRepo, scenarioRepo, touchstoneRepo, mock(), mock())

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

        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), touchstoneRepo, mock(), mock())

        Assertions.assertThatThrownBy {
            sut.validateResponsibilityPath(path, statusList)
        }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining("Unknown touchstone-version with id 'touchstone-1'")

    }

    @Test
    fun `can get data`()
    {
        val oldUploadedOn = Instant.now()
        val uploadedOn = Instant.now()
        val commentedOn = uploadedOn.minusMillis(1)
        val testResponsibilitiesWithComments = listOf(
                ResponsibilityWithComment(scenarioId, ResponsibilityComment("Note for VIMC, Campaign, Cholera for 202002rfp-1", "test.user2", commentedOn))
        )
        val responsibilitiesRepo = mock<ResponsibilitiesRepository> {
            on { getResponsibilitiesWithCommentsForTouchstone(touchstoneVersionId) } doReturn listOf(
                    ResponsibilitySetWithComments(touchstoneVersionId, groupId,
                            ResponsibilityComment("Note for VIMC for 202002rfp-1", "test.user", uploadedOn),
                            testResponsibilitiesWithComments)
            )
            // Declare that this touchstone has a single responsibility set containing a single responsibility
            // Let current burden estimate set be null because these are retrieved with a separate call
            on { getResponsibilitiesForTouchstone(touchstoneVersionId) } doReturn listOf(
                    ResponsibilitySet(touchstoneVersionId, groupId, ResponsibilitySetStatus.INCOMPLETE, listOf(
                            Responsibility(
                                    Scenario(scenarioId, "Default - Campaign", "Cholera", listOf("202002rfp")),
                                    ResponsibilityStatus.EMPTY,
                                    emptyList(),
                                    null
                            )
                    ))
            )
        }
        val burdenEstimateRepository = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSets(groupId, touchstoneVersionId, scenarioId) } doReturn listOf(
                    BurdenEstimateSet(
                            2,
                            uploadedOn,
                            "test.user",
                            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, "time varying CFR"),
                            BurdenEstimateSetStatus.PARTIAL,
                            listOf("Data is corrupt", "Results are meaningless"),
                            null),
                    BurdenEstimateSet(
                            1,
                            oldUploadedOn,
                            "another.test.user",
                            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "averaged"),
                            BurdenEstimateSetStatus.COMPLETE,
                            listOf(),
                            "originalFile.csv"))
        }
        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), mock(), responsibilitiesRepo, burdenEstimateRepository)
        val result = sut.getTouchstoneResponsibilitiesData(touchstoneVersionId)
        assertThat(result).isEqualTo(listOf(
                ResponsibilityRow(
                        touchstoneVersionId,
                        groupId,
                        1,
                        "Note for VIMC for 202002rfp-1",
                        uploadedOn,
                        "test.user",
                        "Default - Campaign",
                        "Cholera",
                        2,
                        uploadedOn,
                        "test.user",
                        BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN,
                        "time varying CFR",
                        BurdenEstimateSetStatus.PARTIAL,
                        "Data is corrupt, Results are meaningless",
                        "Note for VIMC, Campaign, Cholera for 202002rfp-1",
                        commentedOn,
                        "test.user2"
                ),
                ResponsibilityRow(
                        touchstoneVersionId,
                        groupId,
                        1,
                        "Note for VIMC for 202002rfp-1",
                        uploadedOn,
                        "test.user",
                        "Default - Campaign",
                        "Cholera",
                        1,
                        oldUploadedOn,
                        "another.test.user",
                        BurdenEstimateSetTypeCode.CENTRAL_AVERAGED,
                        "averaged",
                        BurdenEstimateSetStatus.COMPLETE,
                        "",
                        "Note for VIMC, Campaign, Cholera for 202002rfp-1",
                        commentedOn,
                        "test.user2"
                )
        ))
    }

}
