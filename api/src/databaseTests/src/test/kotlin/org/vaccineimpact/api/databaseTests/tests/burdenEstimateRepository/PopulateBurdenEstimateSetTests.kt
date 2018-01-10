package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.Record
import org.jooq.Result
import org.junit.Test
import org.vaccineimpact.api.app.errors.*
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.BURDEN_ESTIMATE
import org.vaccineimpact.api.db.Tables.BURDEN_OUTCOME
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addModelRun
import org.vaccineimpact.api.db.direct.addModelRunParameterSet
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.toDecimal
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import org.vaccineimpact.api.models.BurdenEstimateWithRunId
import org.vaccineimpact.api.models.CreateBurdenEstimateSet
import java.math.BigDecimal

class PopulateBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
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
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "complete")
        }
    }

    @Test
    fun `can populate burden estimate set with model run information`()
    {
        val (returnedIds, modelRunData) = withDatabase { db ->
            val returnedIds = setupDatabase(db)
            val modelRunData = addModelRuns(db, returnedIds.responsibilitySetId, returnedIds.modelVersion!!)
            Pair(returnedIds, modelRunData)
        }
        val setId = withRepo { repo ->
            val properties = defaultProperties.copy(modelRunParameterSetId = modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            val data = data(modelRunData.externalIds)
            repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            setId
        }
        withDatabase { db ->
            checkBurdenEstimates(db, setId)
            checkModelRuns(db, modelRunData)
            checkBurdenEstimateSetMetadata(db, setId, returnedIds, "complete")
        }
    }

    @Test
    fun `cannot populate a set unless status is empty`()
    {
        JooqContext().use {
            val returnedIds = setupDatabase(it)
            val setId = it.addBurdenEstimateSet(returnedIds.responsibility, returnedIds.modelVersion!!, username, "complete")

            val repo = makeRepository(it)
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThis burden estimate set is marked as complete." +
                            " You must create a new set if you want to upload any new estimates.")
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
    fun `cannot create burden estimates with diseases that do not match scenario`()
    {
        val badData = data().map { it.copy(disease = "YF") }
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(InconsistentDataError::class.java)
        }
    }

    @Test
    fun `cannot populate burden estimates with non-existent countries`()
    {
        val badData = data().map { it.copy(country = "FAKE") }
        JooqContext().use { db ->
            setupDatabase(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, badData)
            }.isInstanceOf(UnknownObjectError::class.java).matches {
                (it as UnknownObjectError).typeName == "country"
            }
        }
    }

    @Test
    fun `cannot populate burden estimate set if cohort_size is missing from burden_outcome table`()
    {
        JooqContext().use { db ->
            setupDatabase(db)
            db.dsl.deleteFrom(BURDEN_OUTCOME).where(BURDEN_OUTCOME.CODE.eq("cohort_size")).execute()
            val repo = makeRepository(db)
            assertThatThrownBy {
                val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data())
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
            val properties = defaultProperties.copy(modelRunParameterSetId = modelRunData.runParameterSetId)
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
            val data = data(listOf("bad-id-1", "bad-id-2"))
            assertThatThrownBy {
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
            val setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            val data = data(modelRunData.externalIds)
            assertThatThrownBy {
                repo.populateBurdenEstimateSet(setId, groupId, touchstoneId, scenarioId, data)
            }.isInstanceOf(UnknownRunIdError::class.java)
        }
    }

}