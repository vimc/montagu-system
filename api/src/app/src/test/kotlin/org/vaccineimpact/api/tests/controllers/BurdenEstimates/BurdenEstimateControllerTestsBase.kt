package org.vaccineimpact.api.tests.controllers.BurdenEstimates

import com.nhaarman.mockito_kotlin.*
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

abstract class BurdenEstimateControllerTestsBase: MontaguTests() {

    protected val groupId = "group-1"
    protected val touchstoneVersionId = "touchstone-1"
    protected val scenarioId = "scenario-1"

    protected fun mockTouchstones() = mock<SimpleDataSet<TouchstoneVersion, String>> {
        on { get(touchstoneVersionId) } doReturn TouchstoneVersion(touchstoneVersionId, "touchstone", 1, "Description", TouchstoneStatus.OPEN)
        on { get("touchstone-bad") } doReturn TouchstoneVersion("touchstone-bad", "touchstone", 1, "not open", TouchstoneStatus.IN_PREPARATION)
    }

    protected fun mockTouchstoneRepository(touchstoneVersionSet: SimpleDataSet<TouchstoneVersion, String> = mockTouchstones()) =
            mock<TouchstoneRepository> {
                on { touchstoneVersions } doReturn touchstoneVersionSet
            }

    protected fun mockEstimatesRepository(
            touchstoneVersionSet: SimpleDataSet<TouchstoneVersion, String> = mockTouchstones(),
            existingBurdenEstimateSet: BurdenEstimateSet = defaultEstimateSet
    ): BurdenEstimateRepository
    {
        val touchstoneRepo = mockTouchstoneRepository(touchstoneVersionSet)
        return mock {
            on { touchstoneRepository } doReturn touchstoneRepo
            on { getBurdenEstimateSet(any(), any(), any(), any()) } doReturn existingBurdenEstimateSet
            on { createBurdenEstimateSet(any(), any(), any(), any(), any(), any()) } doReturn 1
        }
    }

    protected fun mockModellingGroupRepository(): ModellingGroupRepository
    {
        return mock()
    }

    protected fun mockScenarioRepository(): ScenarioRepository
    {
        return mock()
    }

    protected fun mockLogic(): BurdenEstimateLogic
    {
        return mock {
            on { populateBurdenEstimateSet(any(), any(), any(), any(), any()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(4).toList()
                Unit
            }
        }
    }

    protected fun verifyValidResponsibilityPathChecks(burdenEstimatesLogic: BurdenEstimateLogic, context: ActionContext)
    {
        verify(burdenEstimatesLogic).validateResponsibilityPath(any(), any())
        verify(context).hasPermission(any())
    }

    protected val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList()
    )
}