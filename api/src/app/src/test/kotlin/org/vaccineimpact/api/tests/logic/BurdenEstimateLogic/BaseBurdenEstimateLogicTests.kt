package org.vaccineimpact.api.tests.logic.BurdenEstimateLogic

import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doAnswer
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ExpectationsRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.CohortRestriction
import org.vaccineimpact.api.models.expectations.CountryOutcomeExpectations
import org.vaccineimpact.api.models.expectations.ExpectationMapping
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

abstract class BaseBurdenEstimateLogicTests : MontaguTests()
{
    protected val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList(),
            null
    )

    protected val disease = "disease-1"
    protected val responsibilityId = 1
    protected val setId = 1
    protected val groupId = "group-1"
    protected val touchstoneVersionId = "touchstone-1"
    protected val scenarioId = "scenario-1"

    protected fun mockWriter(): BurdenEstimateWriter
    {
        return mock {
            on { addEstimatesToSet(any(), any(), any()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(1).toList()
                Unit
            }
        }
    }

    protected val fakeExpectations = CountryOutcomeExpectations(1, "desc", 2000..2001, 1..2, CohortRestriction(),
            listOf(Country("AFG", "")),
            listOf())

    protected fun mockExpectationsRepository(): ExpectationsRepository = mock {
        on { getExpectationsForResponsibility(responsibilityId) } doReturn ExpectationMapping(fakeExpectations, listOf(), disease)
    }

    protected fun mockGroupRepository(): ModellingGroupRepository = mock {
        on { getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "description")
    }

    protected fun mockEstimatesRepository(mockEstimateWriter: BurdenEstimateWriter = mockWriter(),
                                        existingBurdenEstimateSet: BurdenEstimateSet = defaultEstimateSet
    ): BurdenEstimateRepository
    {
        return mock {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn existingBurdenEstimateSet
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
            on { centralEstimateWriter } doReturn mockEstimateWriter
        }
    }

    protected val validData = sequenceOf(
            BurdenEstimateWithRunId("yf", null, 2000, 1, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2001, 1, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2000, 2, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )),
            BurdenEstimateWithRunId("yf", null, 2001, 2, "AFG", "Afghanistan", 1000F, mapOf(
                    "deaths" to 10F,
                    "cases" to 100F
            )))

}