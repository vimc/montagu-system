package org.vaccineimpact.api.tests.logic.BurdenEstimateLogic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.logic.Notifier
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.BurdenEstimateSetStatus
import org.vaccineimpact.api.models.BurdenEstimateWithRunId

class PopulateBurdenEstimateLogicTests : BaseBurdenEstimateLogicTests()
{

    @Test
    fun `can populate a set if status is partial`()
    {
        val writer = mockWriter()
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.PARTIAL)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
            on { centralEstimateWriter } doReturn writer
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData, null)
        verify(writer).addEstimatesToSet(eq(setId), any(), eq(disease))
    }

    @Test
    fun `cannot populate a set if status is complete`()
    {
        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn defaultEstimateSet
                    .copy(status = BurdenEstimateSetStatus.COMPLETE)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData, null)
        }.isInstanceOf(InvalidOperationError::class.java)
                .hasMessageContaining("You must create a new set if you want to upload any new estimates.")

    }

    @Test
    fun `cannot populate with data with multiple diseases`()
    {
        val data = sequenceOf(
                BurdenEstimateWithRunId("yf", null, 2000, 1, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                BurdenEstimateWithRunId("menA", null, 2001, 2, "AFG", "Afghanistan", 2000F, mapOf(
                        "deaths" to 20F,
                        "dalys" to 73.6F
                )))
        val estimateWriter = mockWriter()
        val estimatesRepo = mockEstimatesRepository(estimateWriter)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), estimatesRepo, mockExpectationsRepository(), mock(), mock(), mock())
        Assertions.assertThatThrownBy {
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data, null)
        }.isInstanceOf(InconsistentDataError::class.java)
                .hasMessageContaining("disease")
    }

    @Test
    fun `can populate burden estimate set`()
    {
        val writer = mockWriter()
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData, null)

        verify(writer).addEstimatesToSet(eq(setId), any(), eq(disease))
    }

    @Test
    fun `set is marked as partial after being populated`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData, null)
        verify(repo).changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.PARTIAL)
    }

    @Test
    fun `original filename is updated`()
    {
        val repo = mockEstimatesRepository()
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, validData, "file.csv")
        verify(repo).updateBurdenEstimateSetFilename(setId, "file.csv")
    }

}