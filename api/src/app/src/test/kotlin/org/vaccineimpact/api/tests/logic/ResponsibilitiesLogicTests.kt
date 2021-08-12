package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesResponsibilitiesLogic
import org.vaccineimpact.api.app.logic.ResponsibilitiesRow
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.CohortRestriction
import org.vaccineimpact.api.models.expectations.CountryOutcomeExpectations
import org.vaccineimpact.api.models.expectations.ExpectationMapping
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

        val sut = RepositoriesResponsibilitiesLogic(groupRepo, scenarioRepo, touchstoneRepo, mock(), mock(), mock())

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

        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), touchstoneRepo, mock(), mock(), mock())

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
            // Declare this this touchstone has a single responsibility set containing a single responsibility, and that it has had a burden estimate set uploaded
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
                                            emptyList(),
                                            null
                                    )
                            )
                    ))
            )
        }
        // Declare that the responsibility is associated with 6 expectations: 1 country * 2 years * 3 ages. We therefore require 6 burden estimates.
        val expectationMapping = ExpectationMapping(CountryOutcomeExpectations(77, "", 2001..2002, 97..99, CohortRestriction(), listOf(Country("UK", "United Kingdom")), listOf()), listOf(""), "Cholera")
        val expectationsRepo = mock<ExpectationsRepository> {
            on { getExpectationsForResponsibility(42) } doReturn expectationMapping
        }
        val burdenEstimateRepo = mock<BurdenEstimateRepository> {
            // Define the database entry that corresponds to the touchstone's single responsibility
            on { getResponsibilityInfo("VIMC", "202002rfp-1", "scenario-1") } doReturn ResponsibilityInfo(42, "Cholera", "open", 100)
            // Declare that one burden estimate has been provided i.e. 5 responsibilities remain unfulfilled
            on { validateEstimates(any(), any()) } doReturn expectationMapping.expectation.copy().expectedRowLookup().apply {
                this["UK"]!![97]!![2001] = true
            }
        }
        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), mock(), responsibilitiesRepo, burdenEstimateRepo, expectationsRepo)
        val result = sut.getTouchstoneResponsibilitiesData("202002rfp-1")
        assertThat(result).isEqualTo(listOf(
                ResponsibilitiesRow(
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
                        5,
                        "Note for VIMC, Campaign, Cholera for 202002rfp-1",
                        then,
                        "test.user2"
                )
        ))
    }

}
