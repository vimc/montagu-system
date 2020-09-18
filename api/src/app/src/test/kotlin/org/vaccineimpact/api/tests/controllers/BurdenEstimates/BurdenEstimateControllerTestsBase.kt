package org.vaccineimpact.api.tests.controllers.BurdenEstimates

import com.nhaarman.mockito_kotlin.*
import org.vaccineimpact.api.app.context.ActionContext
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.ResponsibilitiesLogic
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.SimpleDataSet
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

abstract class BurdenEstimateControllerTestsBase : MontaguTests()
{

    protected val groupId = "group-1"
    protected val touchstoneVersionId = "touchstone-1"
    protected val scenarioId = "scenario-1"
    protected val diseaseId = "disease-1"

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
            on { getResponsibilityInfo(groupId, touchstoneVersionId, scenarioId) } doReturn
                    ResponsibilityInfo(1, diseaseId, "status", 1)
            on { touchstoneRepository } doReturn touchstoneRepo
            on { getBurdenEstimateSet(any(), any(), any(), any()) } doReturn existingBurdenEstimateSet
        }
    }

    protected fun mockLogic(): BurdenEstimateLogic
    {
        return mock {
            on { populateBurdenEstimateSet(any(), any(), any(), any(), any(), anyOrNull()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(4).toList()
                Unit
            }
            on { createBurdenEstimateSet(any(), any(), any(), any(), any(), any()) } doReturn 1
        }
    }

    protected fun verifyValidResponsibilityPathChecks(responsibilitiesLogic: ResponsibilitiesLogic, context: ActionContext)
    {
        verify(responsibilitiesLogic).validateResponsibilityPath(any(), any())
        verify(context).hasPermission(any())
    }

    protected val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList(),
            null)
}