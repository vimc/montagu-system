package org.vaccineimpact.api.tests.logic.BurdenEstimateLogic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.assertj.core.api.Java6Assertions.assertThat
import org.assertj.core.api.Java6Assertions.assertThatThrownBy
import org.junit.Test
import org.mockito.internal.verification.Times
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetStatus
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class CreateBurdenEstimateLogicTests : MontaguTests()
{
    private val defaultProperties = CreateBurdenEstimateSet(
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_UNKNOWN),
            modelRunParameterSet = null
    )

    private val groupId = "g1"
    private val realGroupId = "real-g1"
    private val touchstoneVersionId = "t1"
    private val scenarioId = "s1"
    private val responsibilityId = 1000
    private val modelVersionId = 2
    private val disease = "disease1"

    private val mockGroupRepo = mock<ModellingGroupRepository>() {
        on { getModellingGroup(groupId) } doReturn ModellingGroup(realGroupId, "desc")
        on { getLatestModelVersionForGroup(realGroupId, disease) } doReturn modelVersionId
    }

    private fun getBurdenRepo(responsibilitySetStatus: ResponsibilitySetStatus): BurdenEstimateRepository
    {
        return mock {
            on {
                getResponsibilityInfo(realGroupId, touchstoneVersionId, scenarioId)
            } doReturn
                    ResponsibilityInfo(responsibilityId, disease, responsibilitySetStatus.toString().lowercase(), 100)
            on {
                createBurdenEstimateSet(eq(responsibilityId), eq(modelVersionId), any(), eq("uploader"), any())
            } doReturn 123
            on {
                addModelRunParameterSet(eq(realGroupId), eq(touchstoneVersionId), eq(modelVersionId), any(), any(), any())
            } doReturn 456
        }
    }

    @Test
    fun `creates burden estimate set for incomplete responsibility set`()
    {
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, getBurdenRepo(ResponsibilitySetStatus.INCOMPLETE), mock(), mock(), mock(), mock())
        val result =
                sut.createBurdenEstimateSet(groupId,
                        touchstoneVersionId,
                        scenarioId,
                        defaultProperties,
                        "uploader",
                        Instant.now())
        assertThat(result).isEqualTo(123)
    }

    @Test
    fun `cannot create burden estimate set if responsibility set status is submitted`()
    {
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, getBurdenRepo(ResponsibilitySetStatus.SUBMITTED), mock(), mock(), mock(), mock())
        assertThatThrownBy {
            sut.createBurdenEstimateSet(groupId,
                    touchstoneVersionId,
                    scenarioId,
                    defaultProperties,
                    "uploader",
                    Instant.now())
        }.isInstanceOf(InvalidOperationError::class.java)
                .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been submitted for review." +
                        " You cannot upload any new estimates.")

    }

    @Test
    fun `cannot create burden estimate set if responsibility set status is approved`()
    {
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, getBurdenRepo(ResponsibilitySetStatus.APPROVED), mock(), mock(), mock(), mock())
        assertThatThrownBy {
            sut.createBurdenEstimateSet(groupId,
                    touchstoneVersionId,
                    scenarioId,
                    defaultProperties,
                    "uploader",
                    Instant.now())
        }.isInstanceOf(InvalidOperationError::class.java)
                .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been reviewed and approved." +
                        " You cannot upload any new estimates.")

    }


    @Test
    fun `checks model run parameter set exists if provided`()
    {
        val properties = defaultProperties.copy(modelRunParameterSet = 111)
        val mockRepo = getBurdenRepo(ResponsibilitySetStatus.INCOMPLETE)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, mockRepo, mock(), mock(), mock(), mock())
        sut.createBurdenEstimateSet(groupId,
                touchstoneVersionId,
                scenarioId,
                properties,
                "uploader",
                Instant.now())

        verify(mockRepo).checkModelRunParameterSetExists(111, realGroupId, touchstoneVersionId)
    }

    @Test
    fun `does not check model run parameter set exists if not provided`()
    {
        val mockRepo = getBurdenRepo(ResponsibilitySetStatus.INCOMPLETE)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, mockRepo, mock(), mock(), mock(), mock())
        sut.createBurdenEstimateSet(groupId,
                touchstoneVersionId,
                scenarioId,
                defaultProperties,
                "uploader",
                Instant.now())
        verify(mockRepo, Times(0)).checkModelRunParameterSetExists(any(), any(), any())
    }

    @Test
    fun `creates model run parameter set`()
    {
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, getBurdenRepo(ResponsibilitySetStatus.INCOMPLETE), mock(), mock(), mock(), mock())

        val result = sut.addModelRunParameterSet(groupId, touchstoneVersionId, disease,
                listOf(ModelRun("run1", mapOf())), "uploader", Instant.now())
        assertThat(result).isEqualTo(456)
    }

    @Test
    fun `cannot create model run parameter set if no model runs provided`()
    {
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepo, getBurdenRepo(ResponsibilitySetStatus.INCOMPLETE), mock(), mock(), mock(), mock())

        Assertions.assertThatThrownBy {
            sut.addModelRunParameterSet(groupId, touchstoneVersionId, disease,
                    listOf(), "uploader", Instant.now())
        }.isInstanceOf(BadRequest::class.java)
                .hasMessageContaining("No model runs provided")

    }

}