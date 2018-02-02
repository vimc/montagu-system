package org.vaccineimpact.api.databaseTests.tests

import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.times
import com.nhaarman.mockito_kotlin.verify
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.postgresql.util.PSQLException
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_STOCHASTIC
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addResponsibility
import org.vaccineimpact.api.db.direct.addScenarioDescription
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import java.math.BigDecimal

class PopulateBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    override val usesAnnex = true

    @Test
    fun `can populate burden estimate set`()
    {
        val returnedIds = withDatabase { db ->
            setupDatabase(db)
        }
        val setId = withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
            setId
        }
        withDatabase { db ->
            checkBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
        }
    }

    @Test
    fun `can populate burden estimate set more than once`()
    {
        val d = data()
        val returnedIds = withDatabase { db -> setupDatabase(db) }
        val setId = withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, d.take(1))
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, d.drop(1))
            setId
        }
        withDatabase { db ->
            checkBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
        }
    }

    @Test
    fun `can populate stochastic burden estimate set`()
    {
        val (setId, modelRunData, returnedIds) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            val setId = db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, setType = "stochastic", timestamp = timestamp, modelRunParameterSetId = modelRunData.runParameterSetId)
            Triple(setId, modelRunData, returnedIds)
        }

        withRepo { repo ->
            val data = data(modelRunData.externalIds)
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
        }
        withDatabase { db ->
            checkStochasticBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "partial")
            checkStochasticModelRuns(db, modelRunData)
        }
    }

    @Test
    fun `uses central estimate writer when set type is central`()
    {
        val mockCentralEstimateWriter = mock<CentralBurdenEstimateWriter>()
        val mockStochasticEstimateWriter = mock<StochasticBurdenEstimateWriter>()
        withDatabase { db ->
            setupDatabase(db)
            val data = data()
            val sut = makeRepository(db, mockCentralEstimateWriter, mockStochasticEstimateWriter)
            val setId = sut.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)

            verify(mockCentralEstimateWriter).addEstimatesToSet(setId, data, diseaseId)
            verify(mockStochasticEstimateWriter, times(0)).addEstimatesToSet(setId, data, diseaseId)
        }
    }

    @Test
    fun `uses stochastic estimate writer when set type is stochastic`()
    {
        val mockCentralEstimateWriter = mock<CentralBurdenEstimateWriter>()
        val mockStochasticEstimateWriter = mock<StochasticBurdenEstimateWriter>()
        withDatabase { db ->
            setupDatabase(db)
            val data = data()
            val sut = makeRepository(db, mockCentralEstimateWriter, mockStochasticEstimateWriter)
            val setId = sut.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultStochasticProperties, username, timestamp)
            sut.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)

            verify(mockCentralEstimateWriter, times(0)).addEstimatesToSet(setId, data, diseaseId)
            verify(mockStochasticEstimateWriter).addEstimatesToSet(setId, data, diseaseId)
        }
    }

    @Test
    fun `cannot populate a set if status is complete`()
    {
        JooqContext().use {
            val returnedIds = setupDatabase(it)
            val setId = it.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion!!, username, "complete")

            val repo = makeRepository(it)
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessageContaining("You must create a new set if you want to upload any new estimates.")
        }
    }

    @Test
    fun `populate set throws unknown object error if set does not exist`()
    {
        JooqContext().use {
            setupDatabase(it)
            val repo = makeRepository(it)
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(12, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `populate set throws unknown object error if set is for different responsibility`()
    {
        val scenario2 = "scenario-2"
        val setId = withDatabase {
            val returnedIds = setupDatabase(it)
            it.addScenarioDescription(scenario2, "Test scenario 2", diseaseId, addDisease = false)
            val responsibilityId = it.addResponsibility(returnedIds.responsibilitySetId, touchstoneId, scenario2)
            it.addBurdenEstimateSet(responsibilityId, returnedIds.modelVersion!!, username, "complete")
        }
        withRepo { repo ->
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    @Test
    fun `populate central estimate set with duplicate rows throws error`()
    {
        val setId = withDatabase {
            setupDatabaseWithBurdenEstimateSet(it)
        }
        val estimates = sequenceOf(estimateObject(), estimateObject())
        withRepo { repo ->
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, estimates)
            }.isInstanceOf(PSQLException::class.java)
        }
        assertThatTableIsEmpty(BURDEN_ESTIMATE)
    }

    @Test
    fun `populate stochastic estimate set with duplicate rows throws error`()
    {
        val (setId, modelRunId) = withDatabase { db ->
            val ids = setupDatabase(db)
            val modelRunData = addModelRuns(db, ids.responsibilitySetId, ids.modelVersion!!)
            val setId = db.addBurdenEstimateSet(ids.responsibility, ids.modelVersion,
                    username, setType = "stochastic", modelRunParameterSetId = modelRunData.runParameterSetId)
            Pair(setId, modelRunData.externalIds.first())
        }
        val estimates = sequenceOf(
                estimateObject(runId = modelRunId),
                estimateObject(runId = modelRunId)
        )
        withRepo { repo ->
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, estimates)
            }.isInstanceOf(PSQLException::class.java)
        }
        assertThatTableIsEmpty(BURDEN_ESTIMATE_STOCHASTIC)
    }

    private fun estimateObject(
            diseaseId: String = this.diseaseId,
            runId: String? = null,
            year: Int = 2000,
            age: Int = 25,
            countryId: String = "AFG",
            countryName: String = "Afghanistan",
            cohortSize: BigDecimal = 100.toBigDecimal(),
            outcomes: Map<String, BigDecimal> = emptyMap()
    ): BurdenEstimateWithRunId
    {
        return BurdenEstimateWithRunId(diseaseId, runId, year, age, countryId, countryName, cohortSize, outcomes)
    }

}