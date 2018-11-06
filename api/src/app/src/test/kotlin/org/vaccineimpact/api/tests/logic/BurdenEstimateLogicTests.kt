package org.vaccineimpact.api.tests.logic

import com.nhaarman.mockito_kotlin.*
import org.assertj.core.api.Assertions
import org.junit.Test
import org.postgresql.util.PSQLException
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.logic.BurdenEstimateLogic
import org.vaccineimpact.api.app.logic.RepositoriesBurdenEstimateLogic
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.ResponsibilityInfo
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addResponsibility
import org.vaccineimpact.api.db.direct.addScenarioDescription
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.test_helpers.MontaguTests
import java.time.Instant

class BurdenEstimateLogicTests : MontaguTests()
{
    private val defaultEstimateSet = BurdenEstimateSet(
            1, Instant.now(), "test.user",
            BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"),
            BurdenEstimateSetStatus.EMPTY,
            emptyList()
    )

    private val disease = "disease-1"
    private val responsibilityId = 1
    private val setId = 1
    private val groupId = "group-1"
    private val touchstoneVersionId = "touchstone-1"
    private val scenarioId = "scenario-1"

    private fun mockWriter(): BurdenEstimateWriter
    {
        return mock {
            on { addEstimatesToSet(any(), any(), any()) } doAnswer { args ->
                // Force evaluation of sequence
                args.getArgument<Sequence<BurdenEstimateWithRunId>>(1).toList()
                Unit
            }
        }
    }

    private fun mockEstimatesRepository(mockEstimateWriter: BurdenEstimateWriter = mockWriter(),
                                        existingBurdenEstimateSet: BurdenEstimateSet = defaultEstimateSet
    ): BurdenEstimateRepository
    {
        return mock {
            on { getBurdenEstimateSetForResponsibility(any(), any()) } doReturn existingBurdenEstimateSet
            on { getResponsibilityInfo(any(), any(), any()) } doReturn
                    ResponsibilityInfo(responsibilityId, disease, "open", setId)
            on { getEstimateWriter(any()) } doReturn mockEstimateWriter
        }
    }

    private val fakeExpectations = Expectations(1, "desc", 1..11, 2000..2009, CohortRestriction(), listOf(), listOf())

    private fun mockExpectationsRepository(): ExpectationsRepository = mock {
        on { getExpectationsForResponsibility(responsibilityId) } doReturn ExpectationMapping(fakeExpectations, listOf(), disease)
    }

    private fun mockGroupRepository(): ModellingGroupRepository = mock {
        on { getModellingGroup(groupId) } doReturn ModellingGroup(groupId, "description")
    }

    val basicData =  sequenceOf(
        BurdenEstimateWithRunId("yf", null, 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                "deaths" to 10F,
                "cases" to 100F
        )),
        BurdenEstimateWithRunId("yf", null, 1980, 30, "AGO", "Angola", 2000F, mapOf(
                "deaths" to 20F,
                "dalys" to 73.6F
        )))

    @Test
    fun `cannot upload data with multiple diseases`()
    {
        val data = sequenceOf(
                BurdenEstimateWithRunId("yf", null, 2000, 50, "AFG", "Afghanistan", 1000F, mapOf(
                        "deaths" to 10F,
                        "cases" to 100F
                )),
                BurdenEstimateWithRunId("menA", null, 1980, 30, "AGO", "Angola", 2000F, mapOf(
                        "deaths" to 20F,
                        "dalys" to 73.6F
                )))
        val estimateWriter = mockWriter()
        val estimatesRepo = mockEstimatesRepository(estimateWriter)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), estimatesRepo, mockExpectationsRepository())
        Assertions.assertThatThrownBy {
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data)
        }.isInstanceOf(InconsistentDataError::class.java)
    }

    @Test
    fun `can populate burden estimate set`()
    {
        val writer = mockWriter()
        val repo = mockEstimatesRepository(writer)
        val sut = RepositoriesBurdenEstimateLogic(mockGroupRepository(), repo, mockExpectationsRepository())

        sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, basicData)
        verify(writer.addEstimatesToSet(setId, basicData, disease))
    }

//    @Test
//    fun `can populate burden estimate set more than once`()
//    {
//        val d = data()
//        val returnedIds = withDatabase { db -> setupDatabase(db) }
//        val setId = withRepo { repo ->
//            val setId = repo.createBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, defaultProperties, username, timestamp)
//            repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, d.take(1))
//            repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, d.drop(1))
//            setId
//        }
//        withDatabase { db ->
//            checkBurdenEstimates(db, setId)
//            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
//        }
//    }

//    @Test
//    fun `can populate stochastic burden estimate set`()
//    {
//        val (setId, modelRunData, returnedIds) = withDatabase { db ->
//            val returnedIds = setupDatabase(db)
//            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
//            val setId = db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
//                    username, setType = "stochastic", timestamp = timestamp, modelRunParameterSetId = modelRunData.runParameterSetId)
//            Triple(setId, modelRunData, returnedIds)
//        }
//
//        withRepo { repo ->
//            val data = data(modelRunData.externalIds)
//            repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data)
//        }
//        withDatabase { db ->
//            checkStochasticBurdenEstimates(db, setId)
//            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
//            checkStochasticModelRuns(db, modelRunData)
//        }
//    }
//
//    @Test
//    fun `uses central estimate writer when set type is central`()
//    {
//        val mockCentralEstimateWriter = mock<CentralBurdenEstimateWriter>()
//        val mockStochasticEstimateWriter = mock<StochasticBurdenEstimateWriter>()
//        withDatabase { db ->
//            setupDatabase(db)
//            val data = data()
//            val sut = makeRepository(db, mockCentralEstimateWriter, mockStochasticEstimateWriter)
//            val setId = sut.createBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, defaultProperties, username, timestamp)
//            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data)
//
//            verify(mockCentralEstimateWriter).addEstimatesToSet(setId, data, diseaseId)
//            verify(mockStochasticEstimateWriter, times(0)).addEstimatesToSet(setId, data, diseaseId)
//        }
//    }
//
//    @Test
//    fun `uses stochastic estimate writer when set type is stochastic`()
//    {
//        val mockCentralEstimateWriter = mock<CentralBurdenEstimateWriter>()
//        val mockStochasticEstimateWriter = mock<StochasticBurdenEstimateWriter>()
//        withDatabase { db ->
//            setupDatabase(db)
//            val data = data()
//            val sut = makeRepository(db, mockCentralEstimateWriter, mockStochasticEstimateWriter)
//            val setId = sut.createBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, defaultStochasticProperties, username, timestamp)
//            sut.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data)
//
//            verify(mockCentralEstimateWriter, times(0)).addEstimatesToSet(setId, data, diseaseId)
//            verify(mockStochasticEstimateWriter).addEstimatesToSet(setId, data, diseaseId)
//        }
//    }
//
//    @Test
//    fun `cannot populate a set if status is complete`()
//    {
//        JooqContext().use {
//            val returnedIds = setupDatabase(it)
//            val setId = it.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion!!, username, "complete")
//
//            val repo = makeRepository(it)
//            Assertions.assertThatThrownBy {
//                repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data())
//            }.isInstanceOf(InvalidOperationError::class.java)
//                    .hasMessageContaining("You must create a new set if you want to upload any new estimates.")
//        }
//    }
//
//    @Test
//    fun `populate set throws unknown object error if set does not exist`()
//    {
//        JooqContext().use {
//            setupDatabase(it)
//            val repo = makeRepository(it)
//            Assertions.assertThatThrownBy {
//                repo.populateBurdenEstimateSet(12, groupId, touchstoneVersionId, scenarioId, data())
//            }.isInstanceOf(UnknownObjectError::class.java)
//        }
//    }
//
//    @Test
//    fun `populate set throws unknown object error if set is for different responsibility`()
//    {
//        val scenario2 = "scenario-2"
//        val setId = withDatabase {
//            val returnedIds = setupDatabase(it)
//            it.addScenarioDescription(scenario2, "Test scenario 2", diseaseId, addDisease = false)
//            val responsibilityId = it.addResponsibility(returnedIds.responsibilitySetId, touchstoneVersionId, scenario2)
//            it.addBurdenEstimateSet(responsibilityId, returnedIds.modelVersion!!, username, "complete")
//        }
//        withRepo { repo ->
//            Assertions.assertThatThrownBy {
//                repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, data())
//            }.isInstanceOf(UnknownObjectError::class.java)
//        }
//    }
//
//    @Test
//    fun `populate central estimate set with duplicate rows throws error`()
//    {
//        val setId = withDatabase {
//            setupDatabaseWithBurdenEstimateSet(it)
//        }
//        val estimates = (1..10000).map {
//            estimateObject()
//        }.asSequence()
//
//        withRepo { repo ->
//            Assertions.assertThatThrownBy {
//                repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, estimates)
//            }.isInstanceOf(PSQLException::class.java)
//        }
//        assertThatTableIsEmpty(Tables.BURDEN_ESTIMATE)
//    }
//
//    @Test
//    fun `populate stochastic estimate set with duplicate rows throws error`()
//    {
//        val (setId, modelRunId) = withDatabase { db ->
//            val ids = setupDatabase(db)
//            val modelRunData = addModelRuns(db, ids.responsibilitySetId, ids.modelVersion!!)
//            val setId = db.addBurdenEstimateSet(ids.responsibility, ids.modelVersion,
//                    username, setType = "stochastic", modelRunParameterSetId = modelRunData.runParameterSetId)
//            Pair(setId, modelRunData.externalIds.first())
//        }
//        val estimates = sequenceOf(
//                estimateObject(runId = modelRunId),
//                estimateObject(runId = modelRunId)
//        )
//        withRepo { repo ->
//            Assertions.assertThatThrownBy {
//                repo.populateBurdenEstimateSet(setId, groupId, touchstoneVersionId, scenarioId, estimates)
//            }.isInstanceOf(PSQLException::class.java)
//        }
//        assertThatTableIsEmpty(Tables.BURDEN_ESTIMATE_STOCHASTIC)
//    }
//
//    private fun estimateObject(
//            diseaseId: String = this.diseaseId,
//            runId: String? = null,
//            year: Int = 2000,
//            age: Int = 25,
//            countryId: String = "AFG",
//            countryName: String = "Afghanistan",
//            cohortSize: Float = 100F,
//            outcomes: Map<String, Float> = emptyMap()
//    ): BurdenEstimateWithRunId
//    {
//        return BurdenEstimateWithRunId(diseaseId, runId, year, age, countryId, countryName, cohortSize, outcomes)
//    }
}