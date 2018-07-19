package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.doThrow
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleResponsibility
import org.vaccineimpact.api.test_helpers.exampleTouchstoneVersion

class ExpectationsLogicTests : MontaguTests()
{
    private val touchstoneVersionId = "t1"
    private val groupId = "g1"
    private val scenarioId = "s1"
    private val responsibilityId = 11
    private val responsibility = exampleResponsibility()
    private val touchstoneVersion = exampleTouchstoneVersion()
    private val responsibilityAndTouchstone = ResponsibilityAndTouchstone(responsibilityId, responsibility, touchstoneVersion)

    private val responsibilitiesRepo = mock<ResponsibilitiesRepository> {
        on { this.getResponsibilityId(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityId
        on { this.getResponsibility(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityAndTouchstone
    }

    private val touchstonesRepo = mock<TouchstoneRepository> {
        on { this.touchstoneVersions } doReturn InMemoryDataSet(listOf(TouchstoneVersion(touchstoneVersionId,
                "", 1, "", TouchstoneStatus.OPEN)))
    }

    private val fakeExpectations = Expectations(1, 1..11, 2000..2009, CohortRestriction(), listOf(), listOf())

    private val expectationsRepo = mock<ExpectationsRepository> {
        on { this.getExpectationsForResponsibility(responsibilityId) } doReturn fakeExpectations
    }

    private val modellingGroupRepo = mock<ModellingGroupRepository> {
        on { this.getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "desc")
    }

    @Test
    fun `gets expectations`()
    {
        val sut = RepositoriesExpectationsLogic(responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo)

        val result = sut.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        assertThat(result.ages).isEqualTo(fakeExpectations.ages)
    }

    @Test
    fun `getExpectationsForResponsibility throws unknown object error if group does not exist`()
    {
        val modellingGroupRepoWithoutGroup = mock<ModellingGroupRepository> {
            on { getModellingGroup(any()) } doThrow UnknownObjectError(groupId, "group")
        }
        val sut = RepositoriesExpectationsLogic(responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepoWithoutGroup,
                touchstonesRepo)

        assertThatThrownBy { sut.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining("group")
    }

    @Test
    fun `getExpectationsForResponsibility throws unknown object error if touchstone version does not exist`()
    {
        val touchstonesRepoWithoutTouchstone = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf())
        }
        val sut = RepositoriesExpectationsLogic(responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepoWithoutTouchstone)

        assertThatThrownBy { sut.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(touchstoneVersionId)
    }

    @Test
    fun `can get responsibility with expectations`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val result = sut.getResponsibilityWithExpectations(groupId, touchstoneVersionId, scenarioId)
        assertThat(result).isEqualTo(ResponsibilityDetails(
                responsibility,
                touchstoneVersion,
                fakeExpectations
        ))
    }

    @Test
    fun `getResponsibilityWithExpectations throws unknown object error if touchstone version does not exist`()
    {
        val touchstonesRepoWithoutTouchstone = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf())
        }
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepoWithoutTouchstone
        )
        assertThatThrownBy { sut.getResponsibilityWithExpectations(groupId, touchstoneVersionId, scenarioId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(touchstoneVersionId)
    }

    @Test
    fun `getResponsibilityWithExpectations throws unknown object error if group does not exist`()
    {
        val modellingGroupRepoWithoutGroup = mock<ModellingGroupRepository> {
            on { getModellingGroup(any()) } doThrow UnknownObjectError(groupId, "group")
        }
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepoWithoutGroup,
                touchstonesRepo
        )
        assertThatThrownBy { sut.getResponsibilityWithExpectations(groupId, touchstoneVersionId, scenarioId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(groupId)
    }
}