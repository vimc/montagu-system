package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.ExpectationsLogic
import org.vaccineimpact.api.app.logic.RepositoriesExpectationsLogic
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ResponsibilitiesRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.responsibilities.ResponsibilityAndTouchstone
import org.vaccineimpact.api.models.responsibilities.ResponsibilityDetails
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetStatus
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleResponsibility
import org.vaccineimpact.api.test_helpers.exampleResponsibilitySet
import org.vaccineimpact.api.test_helpers.exampleTouchstoneVersion

class ExpectationsLogicTests : MontaguTests()
{
    private val touchstoneVersionId = "t1"
    private val groupId = "g1"
    private val otherGroupId = "g2"
    private val scenarioId = "s1"
    private val responsibilityId = 11
    private val responsibility = exampleResponsibility()
    private val touchstoneVersion = exampleTouchstoneVersion()
    private val responsibilityAndTouchstone = ResponsibilityAndTouchstone(responsibilityId, responsibility, touchstoneVersion)
    private val responsibilitySets = listOf(
            exampleResponsibilitySet(touchstoneVersionId, groupId),
            exampleResponsibilitySet(touchstoneVersionId, otherGroupId)
    )

    private val responsibilitiesRepo = mock<ResponsibilitiesRepository> {
        on { this.getResponsibilityId(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityId
        on { this.getResponsibility(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityAndTouchstone
        on { this.getResponsibilitiesForTouchstone(touchstoneVersionId) } doReturn responsibilitySets
    }

    private val expectationId = 2
    private val touchstonesRepo = mock<TouchstoneRepository> {
        on { this.touchstoneVersions } doReturn InMemoryDataSet(listOf(TouchstoneVersion(touchstoneVersionId,
                "", 1, "", TouchstoneStatus.OPEN)))
    }

    private val fakeExpectations = Expectations(expectationId, 1..11, 2000..2009, CohortRestriction(), listOf(), listOf())
    private val fakeExpectationsMapping = listOf(
            ExpectationMapping(fakeExpectations, listOf(scenarioId))
    )

    private val expectationsRepo = mock<ExpectationsRepository> {
        on { this.getExpectationsForResponsibility(responsibilityId) } doReturn fakeExpectations
        on { this.getExpectationsById(expectationId) } doReturn fakeExpectations
        on { this.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId)} doReturn listOf(expectationId)
        on { this.getExpectationsForResponsibilitySet(any(), any()) } doReturn fakeExpectationsMapping
    }

    private val modellingGroupRepo = mock<ModellingGroupRepository> {
        on { this.getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "desc")
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
        assertChecksThatTouchstoneVersionExists { it.getResponsibilityWithExpectations(groupId, touchstoneVersionId, scenarioId) }
    }

    @Test
    fun `getResponsibilityWithExpectations throws unknown object error if group does not exist`()
    {
        assertChecksThatGroupExists { it.getResponsibilityWithExpectations(groupId, touchstoneVersionId, scenarioId) }
    }


    @Test
    fun `can get expectations by expectations id`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val result = sut.getExpectationsById(expectationId, groupId, touchstoneVersionId)
        assertThat(result).isEqualTo(fakeExpectations)
    }

    @Test
    fun `getExpectationsById throws unknown object error if touchstone version does not exist`()
    {
        assertChecksThatTouchstoneVersionExists { it.getExpectationsById(expectationId, groupId, touchstoneVersionId) }
    }

    @Test
    fun `getExpectationsById throws unknown object error if group does not exist`()
    {
        assertChecksThatGroupExists { it.getExpectationsById(expectationId, groupId, touchstoneVersionId) }
    }

    @Test
    fun `getExpectationsById throws unknown object error if expectation does not belong to group & touchstone`()
    {
        val expectationsRepoWithoutExpectations = mock<ExpectationsRepository> {
            on { it.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId)} doReturn listOf<Int>()
        }
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepoWithoutExpectations,
                modellingGroupRepo,
                touchstonesRepo
        )
        assertThatThrownBy { sut.getExpectationsById(expectationId, groupId, touchstoneVersionId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(expectationId.toString())
    }

    @Test
    fun `can get responsibility sets with expectations for touchstone`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val result = sut.getResponsibilitySetsWithExpectations(touchstoneVersionId)
        assertThat(result).isEqualTo(listOf(
                ResponsibilitySetWithExpectations(responsibilitySets[0], fakeExpectationsMapping),
                ResponsibilitySetWithExpectations(responsibilitySets[1], fakeExpectationsMapping)
        ))
        verify(expectationsRepo).getExpectationsForResponsibilitySet(groupId, touchstoneVersionId)
        verify(expectationsRepo).getExpectationsForResponsibilitySet(otherGroupId, touchstoneVersionId)
    }

    @Test
    fun `getResponsibilitySetsWithExpectations throws unknown object error if touchstone version does not exist`()
    {
        assertChecksThatTouchstoneVersionExists { it.getResponsibilitySetsWithExpectations(touchstoneVersionId) }
    }

    private fun assertChecksThatGroupExists(work: (sut: ExpectationsLogic) -> Any)
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
        assertThatThrownBy { work(sut) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(groupId)
    }

    private fun assertChecksThatTouchstoneVersionExists(work: (sut: ExpectationsLogic) -> Any)
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
        assertThatThrownBy { work(sut) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(touchstoneVersionId)
    }
}