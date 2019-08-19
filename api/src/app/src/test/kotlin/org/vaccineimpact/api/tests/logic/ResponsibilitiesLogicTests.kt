package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.controllers.helpers.ResponsibilityPath
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesResponsibilitiesLogic
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.models.TouchstoneStatus
import org.vaccineimpact.api.models.TouchstoneVersion
import org.vaccineimpact.api.test_helpers.MontaguTests

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

        val sut = RepositoriesResponsibilitiesLogic(groupRepo, scenarioRepo, touchstoneRepo)

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

        val sut = RepositoriesResponsibilitiesLogic(mock(), mock(), touchstoneRepo)

        Assertions.assertThatThrownBy {
            sut.validateResponsibilityPath(path, statusList)
        }.isInstanceOf(UnknownObjectError::class.java).hasMessageContaining("Unknown touchstone-version with id 'touchstone-1'")

    }

}