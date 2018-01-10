package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.jooq.Record
import org.jooq.Result
import org.junit.Test
import org.vaccineimpact.api.app.errors.*
import org.vaccineimpact.api.app.repositories.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.BurdenEstimateCopyWriter
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE_SET
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addModelRun
import org.vaccineimpact.api.db.direct.addModelRunParameterSet
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode

class BurdenEstimateWriterTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can populate central burden estimate set`()
    {
        val (returnedIds, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            Pair(returnedIds, modelRunData)
        }
        val setId = withRepo { repo ->
            val properties = defaultProperties.copy(BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC),
                    modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            setId
        }
        withDatabase { db ->

            val sut = BurdenEstimateWriter(db.dsl)
            val data = data(modelRunData.externalIds)

            sut.addEstimatesToSet(setId, data, diseaseId)
            checkBurdenEstimates(db, setId)
            checkModelRuns(db, modelRunData)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "complete")
        }
    }

    @Test
    fun `cannot populate a stochastic set if status is complete`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Pair(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "complete", "stochastic", null, modelRunData.runParameterSetId), modelRunData)
        }
        withRepo { repo ->

            val data = data(modelRunData.externalIds)

            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThis burden estimate set is marked as complete." +
                            " You must create a new set if you want to upload any new estimates.")
        }
    }

    @Test
    fun `can populate a stochastic set if status is partial`()
    {
        val (setId, modelRunData, returnedIds) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Triple(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "partial", "stochastic", null, modelRunData.runParameterSetId, timestamp), modelRunData, returnedIds)
        }
        withRepo { repo ->
            val data = data(modelRunData.externalIds)
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
        }
        withDatabase { db ->
            checkStochasticBurdenEstimates(db, setId)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "complete")
        }
    }

    @Test
    fun `cannot create burden estimates with diseases that do not match scenario`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Pair(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "partial", "stochastic", null, modelRunData.runParameterSetId, timestamp), modelRunData)

        }
        withRepo { repo ->
            val data = data(modelRunData.externalIds)
            val badData = data.map { it.copy(disease = "YF") }
            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(InconsistentDataError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimates with non-existent countries`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)

            Pair(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "partial", "stochastic", null, modelRunData.runParameterSetId, timestamp), modelRunData)
        }
        withRepo { repo ->
            val data = data(modelRunData.externalIds)
            val badData = data.map { it.copy(country = "FAKE") }
            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(UnknownObjectError::class.java).matches {
                (it as UnknownObjectError).typeName == "country"
            }
        }
    }

    @Test
    fun `cannot populate burden estimate set if cohort_size is missing from burden_outcome table`()
    {
        val (setId, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            db.dsl.deleteFrom(Tables.BURDEN_OUTCOME).where(Tables.BURDEN_OUTCOME.CODE.eq("cohort_size")).execute()
            Pair(db.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion,
                    username, "partial", "stochastic", null, modelRunData.runParameterSetId, timestamp), modelRunData)

        }
        withRepo { repo ->
            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data(modelRunData.externalIds))
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `populate set throws error if run ID is unknown`()
    {
        val modelRunData = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            modelRunData
        }
        withRepo { repo ->
            val properties = defaultStochasticProperties.copy(modelRunParameterSetId = modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            val data = data(listOf("bad-id-1", "bad-id-2"))
            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

    @Test
    fun `populate set throws error if run ID is specified but model run parameter set is not`()
    {
        val modelRunData = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            modelRunData
        }
        withRepo { repo ->
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultStochasticProperties, username, timestamp)
            val data = data(modelRunData.externalIds)
            Assertions.assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

}