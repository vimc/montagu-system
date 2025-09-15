package org.vaccineimpact.api.tests.logic.BurdenEstimateLogic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import java.time.Instant

class GetBurdenEstimatesLogicTests : BaseBurdenEstimateLogicTests()
{
    private val fakeBurdenEstimate = BurdenEstimate(disease, 2000, 15, "DEF", "DEF", 100f, mapOf())
    private val burdenRepo = mock<BurdenEstimateRepository> {
        on { getExpectedOutcomesForBurdenEstimateSet(setId) } doReturn listOf(Pair(1.toShort(), "deaths"))
        on { getBurdenEstimateOutcomesSequence(eq(setId), any(), eq(disease)) } doReturn
                sequenceOf(fakeBurdenEstimate)
        on { getBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, setId) } doReturn defaultEstimateSet
    }

    private val scenarioRepo = mock<ScenarioRepository> {
        on { getScenarioForTouchstone(touchstoneVersionId, scenarioId) } doReturn
                Scenario(scenarioId, scenarioId, disease, listOf())
    }

    @Test
    fun `can get burden estimate set data`()
    {
        val sut = RepositoriesBurdenEstimateLogic(
                mock(),
                burdenRepo,
                mock(),
                scenarioRepo,
                mock(),
                mock())
        val result = sut.getBurdenEstimateData(setId, groupId, touchstoneVersionId, scenarioId).data.toList()
        assertThat(result.count()).isEqualTo(1)
        assertThat(result.first()).isEqualTo(fakeBurdenEstimate)
    }

    @Test
    fun `throws error if scenario does not exist`()
    {
        val scenarioRepo = mock<ScenarioRepository> {
            on { checkScenarioDescriptionExists(scenarioId) } doThrow UnknownObjectError("TEST", "scenario-description")
        }
        val sut = RepositoriesBurdenEstimateLogic(
                mock(),
                burdenRepo,
                mock(),
                scenarioRepo,
                mock(),
                mock())

        assertThatThrownBy {
            sut.getBurdenEstimateData(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(UnknownObjectError::class.java)
    }


    @Test
    fun `throws error if metadata is not correct`()
    {
        val burdenRepo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, setId) } doThrow
                    UnknownObjectError(setId, "set")
        }
        val sut = RepositoriesBurdenEstimateLogic(
                mock(),
                burdenRepo,
                mock(),
                scenarioRepo,
                mock(),
                mock())

        assertThatThrownBy {
            sut.getBurdenEstimateData(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `throws error if set is stochastic`()
    {
        val burdenRepo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, setId) } doReturn
                    defaultEstimateSet.copy(type = BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC))
        }
        val sut = RepositoriesBurdenEstimateLogic(
                mock(),
                burdenRepo,
                mock(),
                scenarioRepo,
                mock(),
                mock())

        assertThatThrownBy {
            sut.getBurdenEstimateData(setId, groupId, touchstoneVersionId, scenarioId)
        }.isInstanceOf(InvalidOperationError::class.java)
    }

    @Test
    fun `can get estimated deaths for responsibility`()
    {
        val fakeEstimates: Map<Short, List<BurdenEstimateDataPoint>> =
                mapOf(1.toShort() to listOf(BurdenEstimateDataPoint(2000, 1, 100F)))

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenOutcomeIds("test-outcome") } doReturn listOf(1.toShort(), 2)
            on { getEstimates(any(), any(), any(), any()) } doReturn
                    BurdenEstimateDataSeries(BurdenEstimateGrouping.AGE, fakeEstimates)
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
        }
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository(), mock(), mock(), mock())

        val result = sut.getEstimates(1, groupId, touchstoneVersionId, scenarioId, "test-outcome")
        assertThat(result.data).containsAllEntriesOf(fakeEstimates)
        verify(repo).getBurdenOutcomeIds("test-outcome")
    }

    @Test
    fun `checks that scenario exists when getting burden estimate sets`()
    {
        val repo = mock<ScenarioRepository> {
            on { checkScenarioDescriptionExists("s1") } doThrow UnknownObjectError("TEST", "scenario-description")
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), mock(), mock(), repo, mock(), mock())
        assertThatThrownBy {
            sut.getBurdenEstimateSets("g1", "t1", "s1")
        }.isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `checks that scenario exists when getting burden estimate set`()
    {
        val repo = mock<ScenarioRepository> {
            on { checkScenarioDescriptionExists("s1") } doThrow UnknownObjectError("TEST", "scenario-description")
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), mock(), mock(), repo, mock(), mock())
        assertThatThrownBy {
            sut.getBurdenEstimateSet("g1", "t1", "s1", 1)
        }.isInstanceOf(UnknownObjectError::class.java)
    }

    @Test
    fun `can get burden estimate sets`()
    {
        val fakeEstimateSets = listOf(BurdenEstimateSet(1, Instant.now(), "someone",
                BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, ""),
                BurdenEstimateSetStatus.COMPLETE, listOf(), null))

        val repo = mock<BurdenEstimateRepository> {
            on { getBurdenEstimateSets("g1", "t1", "s1") } doReturn fakeEstimateSets
        }

        val sut = RepositoriesBurdenEstimateLogic(mock(), repo, mock(), mock(), mock(), mock())
        val result = sut.getBurdenEstimateSets("g1", "t1", "s1")
        assertThat(result).hasSameElementsAs(fakeEstimateSets)
    }
}