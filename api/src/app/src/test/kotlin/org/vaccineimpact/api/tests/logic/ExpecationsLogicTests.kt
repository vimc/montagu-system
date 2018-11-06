package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.filters.ScenarioFilterParameters
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
import org.vaccineimpact.api.models.responsibilities.ResponsibilitySetWithExpectations
import org.vaccineimpact.api.test_helpers.MontaguTests
import org.vaccineimpact.api.test_helpers.exampleResponsibility
import org.vaccineimpact.api.test_helpers.exampleResponsibilitySet
import org.vaccineimpact.api.test_helpers.exampleTouchstoneVersion

class ExpectationsLogicTests : MontaguTests()
{
    private val touchstoneVersionId = "t1"
    private val groupId = "g1"
    private val disease = "YF"
    private val otherGroupId = "g2"
    private val scenarioId = "s1"
    private val responsibilityId = 11
    private val responsibility = exampleResponsibility()
    private val touchstoneVersion = exampleTouchstoneVersion()
    private val responsibilityAndTouchstone = ResponsibilityAndTouchstone(responsibilityId, responsibility, touchstoneVersion)
    private val responsibilitySet = exampleResponsibilitySet(touchstoneVersionId, groupId)
    private val responsibilitySets = listOf(
            responsibilitySet,
            exampleResponsibilitySet(touchstoneVersionId, otherGroupId)
    )

    private val responsibilitiesRepo = mock<ResponsibilitiesRepository> {
        on { this.getResponsibilityId(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityId
        on { this.getResponsibility(groupId, touchstoneVersionId, scenarioId) } doReturn responsibilityAndTouchstone
        on { this.getResponsibilitiesForTouchstone(touchstoneVersionId) } doReturn responsibilitySets
        on { this.getResponsibilitiesForGroup(eq(groupId), eq(touchstoneVersionId), any()) } doReturn responsibilitySet
    }

    private val expectationId = 2
    private val touchstonesRepo = mock<TouchstoneRepository> {
        on { this.touchstoneVersions } doReturn InMemoryDataSet(listOf(TouchstoneVersion(touchstoneVersionId,
                "", 1, "", TouchstoneStatus.OPEN)))
    }

    private val fakeExpectations = Expectations(expectationId, "desc", 1..11, 2000..2009, CohortRestriction(), listOf(), listOf())
    private val fakeExpectationsMapping = ExpectationMapping(fakeExpectations, listOf(scenarioId), disease)

    private val expectationsRepo = mock<ExpectationsRepository> {
        on { this.getExpectationsForResponsibility(responsibilityId) } doReturn fakeExpectationsMapping
        on { this.getExpectationsById(expectationId) } doReturn fakeExpectationsMapping
        on { this.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId) } doReturn listOf(expectationId)
        on { this.getExpectationsForResponsibilitySet(any(), any()) } doReturn listOf(fakeExpectationsMapping)
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
        assertThat(result).isEqualTo(fakeExpectationsMapping)
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
            on { it.getExpectationIdsForGroupAndTouchstone(groupId, touchstoneVersionId) } doReturn listOf<Int>()
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
    fun `can get all responsibility sets with expectations for touchstone`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val result = sut.getResponsibilitySetsWithExpectations(touchstoneVersionId)
        assertThat(result).isEqualTo(listOf(
                ResponsibilitySetWithExpectations(responsibilitySets[0], listOf(fakeExpectationsMapping)),
                ResponsibilitySetWithExpectations(responsibilitySets[1], listOf(fakeExpectationsMapping))
        ))
        verify(expectationsRepo).getExpectationsForResponsibilitySet(groupId, touchstoneVersionId)
        verify(expectationsRepo).getExpectationsForResponsibilitySet(otherGroupId, touchstoneVersionId)
    }

    @Test
    fun `getResponsibilitySetsWithExpectations throws if touchstone version does not exist`()
    {
        assertChecksThatTouchstoneVersionExists { it.getResponsibilitySetsWithExpectations(touchstoneVersionId) }
    }

    @Test
    fun `can get particular responsibility set with expectations for modelling group and touchstone`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val filterParameters = ScenarioFilterParameters()
        val result = sut.getResponsibilitySetWithExpectations(groupId, touchstoneVersionId, filterParameters)
        assertThat(result).isEqualTo(ResponsibilitySetWithExpectations(
                responsibilitySets[0],
                listOf(fakeExpectationsMapping))
        )
        verify(responsibilitiesRepo)
                .getResponsibilitiesForGroup(any(), any(), eq(filterParameters))
    }

    @Test
    fun `getResponsibilitySetWithExpectations throws if touchstone version does not exist`()
    {
        assertChecksThatTouchstoneVersionExists {
            it.getResponsibilitySetWithExpectations(groupId, touchstoneVersionId, ScenarioFilterParameters())
        }
    }

    @Test
    fun `getResponsibilitySetWithExpectations throws if group does not exist`()
    {
        assertChecksThatGroupExists {
            it.getResponsibilitySetWithExpectations(groupId, touchstoneVersionId, ScenarioFilterParameters())
        }
    }

    @Test
    fun `can get expectations for responsibility`()
    {
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepo,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        val result = sut.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        assertThat(result).isEqualTo(fakeExpectationsMapping.expectation)
    }

    @Test
    fun `getExpectationsForResponsibility throws if touchstone version does not exist`()
    {
        assertChecksThatTouchstoneVersionExists {
            it.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        }
    }

    @Test
    fun `getExpectationsForResponsibility throws if group does not exist`()
    {
        assertChecksThatGroupExists {
            it.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        }
    }

    @Test
    fun `getExpectationsForResponsibility throws if responsibility does not exist`()
    {
        assertChecksThatResponsibilityExists {
            it.getExpectationsForResponsibility(groupId, touchstoneVersionId, scenarioId)
        }
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

    private fun assertChecksThatResponsibilityExists(work: (sut: ExpectationsLogic) -> Any)
    {
        val responsibilitiesRepoWithoutResponsibility = mock<ResponsibilitiesRepository> {
            on { getResponsibilityId(any(), any(), any()) } doThrow UnknownObjectError(scenarioId, "responsibility")
        }
        val sut = RepositoriesExpectationsLogic(
                responsibilitiesRepoWithoutResponsibility,
                expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo
        )
        assertThatThrownBy { work(sut) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(scenarioId)
    }
}