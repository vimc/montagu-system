package org.vaccineimpact.api.tests.logic.BurdenEstimateLogic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.mockito.Mockito
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.MissingRowsError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.Notifier
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.BurdenEstimateSetStatus
import org.vaccineimpact.api.models.Country
import org.vaccineimpact.api.models.Scenario
import org.vaccineimpact.api.models.responsibilities.Responsibility
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySet
import org.vaccineimpact.api.models.responsibilities.ResponsibilityStatus

class CloseBurdenEstimateSetLogicTests : BaseBurdenEstimateLogicTests()
{
    private fun getResponsibilitiesRepository(): ResponsibilitiesRepository
    {
        return mock {
            on {
                getResponsibilitiesForGroup(eq(groupId), eq(touchstoneVersionId),
                        argThat { this.disease == disease })
            } doReturn ResponsibilitySet(touchstoneVersionId, groupId, null, listOf())
        }
    }

    @Test
    fun `modelling-group id is checked before closing burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        val groupRepo = mockGroupRepository()
        val sut = RepositoriesBurdenEstimateLogic(groupRepo, repo, mockExpectationsRepository(), mock(),
                getResponsibilitiesRepository(), mock())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(groupRepo).getModellingGroup(groupId)
    }

    @Test
    fun `can close non-empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(),
                getResponsibilitiesRepository(), mock())
        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.COMPLETE)
    }

    @Test
    fun `cannot close empty burden estimate set`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(true)
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(),
                getResponsibilitiesRepository(), mock())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(InvalidOperationError::class.java)
    }

    @Test
    fun `cannot close burden estimate set which is already complete`()
    {
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.COMPLETE)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(InvalidOperationError::class.java).hasMessageContaining("This burden estimate set has already been closed")
    }

    @Test
    fun `closing a burden estimate set with missing rows marks it as invalid`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        Mockito.`when`(repo.validateEstimates(any(), any())).doReturn(fakeExpectations.expectedRowLookup())
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(MissingRowsError::class.java)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.INVALID)
    }

    @Test
    fun `missing rows message contains all country names and one example row`()
    {
        val expectations = fakeExpectations.copy(years = 2000..2010, ages = 10..15, countries = listOf(Country("AFG", ""), Country("AGO", ""),
                Country("NGA", "")))

        val rowPresenceLookup = expectations.expectedRowLookup()

        for (year in 2000..2010)
        {
            for (age in 10..15)
            {
                rowPresenceLookup["AFG"]!![age.toShort()]!![year.toShort()] = true

                if (year < 2005 || age < 12)
                {
                    rowPresenceLookup["AGO"]!![age.toShort()]!![year.toShort()] = true
                }
            }
        }
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        Mockito.`when`(repo.validateEstimates(any(), any())).doReturn(rowPresenceLookup)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(MissingRowsError::class.java)
                .hasMessage("""the following problems occurred:
Missing rows for AGO, NGA
For example:
AGO, age 12, year 2005""")
    }

    @Test
    fun `cannot close burden estimate set when responsibility lookup throws an error`()
    {
        val writer = mockWriter()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.PARTIAL)
            on { getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId) } doThrow
                    UnknownObjectError(scenarioId, "responsibility")
            on { centralEstimateWriter } doReturn writer
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining(scenarioId)
    }

    @Test
    fun `notifies when a set is marked as complete`()
    {
        val repo = mockEstimatesRepository()
        val mockNotifier = mock<Notifier>()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(),
                mock(), getResponsibilitiesRepository(), mockNotifier)

        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(mockNotifier).notify(groupId, disease, scenarioId, BurdenEstimateSetStatus.COMPLETE,true, touchstoneVersionId)
    }

    @Test
    fun `notifies when a set is closed but has missing rows`()
    {
        val writer = mockWriter()
        val mockNotifier = mock<Notifier>()
        Mockito.`when`(writer.isSetEmpty(defaultEstimateSet.id)).doReturn(false)
        val repo = mockEstimatesRepository(writer)
        Mockito.`when`(repo.validateEstimates(any(), any())).doReturn(fakeExpectations.expectedRowLookup())
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mockNotifier)

        Assertions.assertThatThrownBy {
            sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(MissingRowsError::class.java)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.INVALID)
        verify(mockNotifier).notify(groupId, disease, scenarioId, BurdenEstimateSetStatus.INVALID,false, touchstoneVersionId)
    }

    @Test
    fun `notifies when all responsibilities have been fulfilled`()
    {
        val responsibilitiesRepository = mock<ResponsibilitiesRepository> {
            on {
                getResponsibilitiesForGroup(eq(groupId), eq(touchstoneVersionId),
                        argThat { this.disease == disease })
            } doReturn ResponsibilitySet(touchstoneVersionId, groupId, null, listOf(responsibilityWithCompleteEstimateSet))
        }

        val repo = mockEstimatesRepository()
        val mockNotifier = mock<Notifier>()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(),
                mock(), responsibilitiesRepository, mockNotifier)

        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(mockNotifier).notify(groupId, disease, scenarioId, BurdenEstimateSetStatus.COMPLETE,true, touchstoneVersionId)
    }

    @Test
    fun `does not notify all responsibilities have been fulfilled if some have an incomplete estimate set`()
    {
        val responsibilitiesRepository = mock<ResponsibilitiesRepository> {
            on {
                getResponsibilitiesForGroup(eq(groupId), eq(touchstoneVersionId),
                        argThat { this.disease == disease })
            } doReturn ResponsibilitySet(touchstoneVersionId, groupId, null,
                    listOf(responsibilityWithCompleteEstimateSet, responsibilityWithoutCompleteEstimateSet))
        }

        val repo = mockEstimatesRepository()
        val mockNotifier = mock<Notifier>()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(),
                mock(), responsibilitiesRepository, mockNotifier)

        sut.closeBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId)
        verify(mockNotifier).notify(groupId, disease, scenarioId, BurdenEstimateSetStatus.COMPLETE,false, touchstoneVersionId)
        verify(mockNotifier, Times(1)).notify(any(), any(), any(), any(), any(), any())
    }

    private val responsibilityWithCompleteEstimateSet = Responsibility(Scenario("s1", "desc", "d1", listOf()),
            ResponsibilityStatus.VALID, listOf(),
            defaultEstimateSet.copy(status = BurdenEstimateSetStatus.COMPLETE))
    private val responsibilityWithoutCompleteEstimateSet = responsibilityWithCompleteEstimateSet
            .copy(currentEstimateSet = defaultEstimateSet)

}