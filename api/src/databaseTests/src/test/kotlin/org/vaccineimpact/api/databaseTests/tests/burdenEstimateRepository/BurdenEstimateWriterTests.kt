package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.errors.UnknownRunIdError
import org.vaccineimpact.api.app.repositories.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet

class BurdenEstimateWriterTests : BurdenEstimateRepositoryTests()
{
    private fun createCentralSetWithoutModelRuns(): Int
    {
        return withDatabase { db ->
            val returnedIds = setupDatabase(db)
            db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion!!,
                    username, timestamp = timestamp)
        }
    }

    private fun createCentralSetWithModelRuns(): Pair<Int, ModelRunTestData>
    {
        return withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            val setId = db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, timestamp = timestamp, modelRunParameterSetId = modelRunData.runParameterSetId)
            Pair(setId, modelRunData)
        }
    }

    private fun createStochasticSetWithModelRuns(): Pair<Int, ModelRunTestData>
    {
        return withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            val setId = db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, setType = "stochastic", timestamp = timestamp, modelRunParameterSetId = modelRunData.runParameterSetId)
            Pair(setId, modelRunData)
        }
    }

    @Test
    fun `can populate central burden estimate set`()
    {
        val setId = createCentralSetWithoutModelRuns()
        withDatabase { db ->
            val sut = BurdenEstimateWriter(db.dsl)

            sut.addEstimatesToSet(setId, data(), diseaseId)
            checkBurdenEstimates(db, setId)
        }
    }

    @Test
    fun `can populate stochastic burden estimate set`()
    {
        val (setId, modelRunData) = createStochasticSetWithModelRuns()
        withDatabase { db ->
            val data = data(modelRunData.externalIds)
            val sut = StochasticBurdenEstimateWriter(db.dsl)

            sut.addEstimatesToSet(setId, data, diseaseId)
            checkStochasticBurdenEstimates(db, setId)
            checkStochasticModelRuns(db, modelRunData)
        }
    }

    @Test
    fun `can populate central burden estimate set with model run information`()
    {
        val (setId, modelRunData) = createCentralSetWithModelRuns()
        withDatabase { db ->
            val data = data(modelRunData.externalIds)

            val sut = BurdenEstimateWriter(db.dsl)
            sut.addEstimatesToSet(setId, data, diseaseId)
            checkBurdenEstimates(db, setId)
            checkModelRuns(db, modelRunData)
        }
    }

    @Test
    fun `cannot create burden estimates with diseases that do not match scenario`()
    {
        val setId = createCentralSetWithoutModelRuns()
        withDatabase { db ->
            val badData = data().map { it.copy(disease = "YF") }

            val sut = BurdenEstimateWriter(db.dsl)

            Assertions.assertThatThrownBy {
                sut.addEstimatesToSet(setId, badData, diseaseId)
            }.isInstanceOf(InconsistentDataError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimates with non-existent countries`()
    {
        val setId = createCentralSetWithoutModelRuns()
        withDatabase { db ->
            val badData = data().map { it.copy(country = "FAKE") }

            val sut = BurdenEstimateWriter(db.dsl)

            Assertions.assertThatThrownBy {
                sut.addEstimatesToSet(setId, badData, diseaseId)
            }.isInstanceOf(UnknownObjectError::class.java).matches {
                (it as UnknownObjectError).typeName == "country"
            }
        }
    }

    @Test
    fun `cannot populate burden estimate set if cohort_size is missing from burden_outcome table`()
    {
        val setId = createCentralSetWithoutModelRuns()
        withDatabase { db ->
            db.dsl.deleteFrom(Tables.BURDEN_OUTCOME).where(Tables.BURDEN_OUTCOME.CODE.eq("cohort_size")).execute()
            val badData = data().map { it.copy(country = "FAKE") }

            val sut = BurdenEstimateWriter(db.dsl)

            Assertions.assertThatThrownBy {
                sut.addEstimatesToSet(setId, badData, diseaseId)
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimate set if run ID is unknown`()
    {
        val (setId, _) = createCentralSetWithModelRuns()

        withDatabase { db ->
            val badData = data(listOf("bad-id-1", "bad-id-2"))

            val sut = BurdenEstimateWriter(db.dsl)

            Assertions.assertThatThrownBy {
                sut.addEstimatesToSet(setId, badData, diseaseId)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimate set if run ID is specified but model run parameter set is not`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            val setId = db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, timestamp = timestamp, modelRunParameterSetId = null)
            Pair(setId, modelRunData)
        }
        withDatabase { db ->
            val data = data(modelRunData.externalIds)
            val sut = BurdenEstimateWriter(db.dsl)

            Assertions.assertThatThrownBy {
                sut.addEstimatesToSet(setId, data, diseaseId)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

}