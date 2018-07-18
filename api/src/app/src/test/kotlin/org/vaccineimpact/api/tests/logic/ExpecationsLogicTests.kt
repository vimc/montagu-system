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
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.inmemory.InMemoryDataSet
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests

class ExpectationsLogicTests : MontaguTests()
{
    private val touchstoneVersionId = "t1"
    private val groupId = "g1"
    private val expectationId = 2
    private val touchstonesRepo = mock<TouchstoneRepository> {
        on { this.touchstoneVersions } doReturn InMemoryDataSet(listOf(TouchstoneVersion(touchstoneVersionId,
                "", 1, "", TouchstoneStatus.OPEN)))
    }

    private val fakeExpectations = Expectations(1..11, 2000..2009, CohortRestriction(), listOf(), listOf())

    private val expectationsRepo = mock<ExpectationsRepository> {
        on { this.getExpectations(expectationId) } doReturn fakeExpectations
    }

    private val modellingGroupRepo = mock<ModellingGroupRepository> {
        on { this.getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "desc")
    }

    @Test
    fun `gets expectations`()
    {
        val sut = RepositoriesExpectationsLogic(expectationsRepo,
                modellingGroupRepo,
                touchstonesRepo)

        val result = sut.getExpectations(groupId, touchstoneVersionId, expectationId)
        assertThat(result.ages).isEqualTo(fakeExpectations.ages)
    }

    @Test
    fun `throws unknown object error if group does not exist`()
    {
        val modellingGroupRepoWithoutGroup = mock<ModellingGroupRepository> {
            on { getModellingGroup(any()) } doThrow UnknownObjectError(groupId, "group")
        }
        val sut = RepositoriesExpectationsLogic(expectationsRepo,
                modellingGroupRepoWithoutGroup,
                touchstonesRepo)

        assertThatThrownBy { sut.getExpectations(groupId, touchstoneVersionId, expectationId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining("group")
    }

    @Test
    fun `throws unknown object error if touchstone version does not exist`()
    {
        val touchstonesRepoWithoutTouchstone = mock<TouchstoneRepository> {
            on { touchstoneVersions } doReturn InMemoryDataSet(listOf())
        }
        val sut = RepositoriesExpectationsLogic(expectationsRepo,
                modellingGroupRepo,
                touchstonesRepoWithoutTouchstone)

        assertThatThrownBy { sut.getExpectations(groupId, touchstoneVersionId, expectationId) }
                .isInstanceOf(UnknownObjectError::class.java)
                .hasMessageContaining(touchstoneVersionId)
    }
}