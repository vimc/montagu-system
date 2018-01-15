package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.jooq.TableField
import org.junit.Test
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.RESPONSIBILITY
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import org.vaccineimpact.api.models.CreateBurdenEstimateSet

class CreateBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can create burden estimate set with empty status`()
    {
        var returnedIds: BurdenEstimateRepositoryTests.ReturnedIds? = null
        var setId: Int? = null

        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
        } andCheckDatabase { db ->
            checkBurdenEstimateSetMetadata(db, setId!!, returnedIds!!, "empty")
        }
    }

    @Test
    fun `when creating burden estimate set, user supplied properties are persisted`()
    {
        val properties = CreateBurdenEstimateSet(
                BurdenEstimateSetType(
                        BurdenEstimateSetTypeCode.CENTRAL_AVERAGED,
                        "mean"
                ), 1
        )
        given { db ->
            setupDatabaseWithModelRunParameterSet(db)
        } makeTheseChanges { repo ->
            repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
        } andCheck { repo ->
            val set = repo.getBurdenEstimateSets(groupId, touchstoneId, scenarioId).single()
            assertThat(set.type).isEqualTo(properties.type)
        }
    }

    @Test
    fun `central estimates update current estimate set`()
    {
        var returnedIds: ReturnedIds? = null
        var setId: Int? = null
        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
        } andCheckDatabase { db ->
            checkCurrentBurdenEstimateSet(db, returnedIds!!, setId!!,
                    RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET)
        }
    }

    @Test
    fun `stochastic estimates update current estimate set`()
    {
        var returnedIds: ReturnedIds? = null
        var setId: Int? = null
        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            val properties = defaultProperties.withType(BurdenEstimateSetTypeCode.STOCHASTIC)
            setId = repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, properties, username, timestamp)
        } andCheckDatabase { db ->
            checkCurrentBurdenEstimateSet(db, returnedIds!!, setId!!,
                    RESPONSIBILITY.CURRENT_STOCHASTIC_BURDEN_ESTIMATE_SET)
        }
    }

    @Test
    fun `cannot create burden estimate set if group has no model`()
    {
        JooqContext().use { db ->
            setupDatabase(db, addModel = false)
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            }.isInstanceOf(DatabaseContentsError::class.java)
        }
    }

    @Test
    fun `cannot create burden estimate set if responsibility set status is submitted`()
    {
        JooqContext().use { db ->
            setupDatabase(db, responsibilitySetStatus = "submitted")
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been submitted for review." +
                            " You cannot upload any new estimates.")
        }
    }

    @Test
    fun `cannot create burden estimate set if responsibility set status is approved`()
    {
        JooqContext().use { db ->
            setupDatabase(db, responsibilitySetStatus = "approved")
            val repo = makeRepository(db)
            assertThatThrownBy {
                repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId, defaultProperties, username, timestamp)
            }.isInstanceOf(OperationNotAllowedError::class.java)
                    .hasMessage("the following problems occurred:\nThe burden estimates uploaded for this touchstone have been reviewed and approved." +
                            " You cannot upload any new estimates.")
        }
    }

    @Test
    fun `throws unknown create burden estimate set if model run parameter set does not exist`()
    {
        assertUnknownObjectError { repo ->
            repo.createBurdenEstimateSet(groupId, touchstoneId, scenarioId,
                    defaultProperties.copy(modelRunParameterSetId = 267), username, timestamp)
        }
    }

    @Test
    fun `cannot create burden estimate set if touchstone doesn't exist`()
    {
        assertUnknownObjectError { repo ->
            repo.createBurdenEstimateSet(groupId, "wrong-id", scenarioId,
                    defaultProperties, username, timestamp)
        }
    }

    @Test
    fun `cannot create burden estimate set if group doesn't exist`()
    {
        assertUnknownObjectError { repo ->
            repo.createBurdenEstimateSet("wrong-id", touchstoneId, scenarioId,
                    defaultProperties, username, timestamp)
        }
    }

    @Test
    fun `cannot create burden estimate set if scenario doesn't exist`()
    {
        assertUnknownObjectError { repo ->
            repo.createBurdenEstimateSet(groupId, touchstoneId, "wrong-id",
                    defaultProperties, username, timestamp)
        }
    }

    private fun assertUnknownObjectError(work: (repo: BurdenEstimateRepository) -> Any)
    {
        JooqContext().use { db ->
            setupDatabaseWithModelRunParameterSet(db)
            val repo = makeRepository(db)
            assertThatThrownBy {
                work(repo)
            }.isInstanceOf(UnknownObjectError::class.java)
        }
    }

    private fun checkCurrentBurdenEstimateSet(db: JooqContext, returnedIds: ReturnedIds, setId: Int,
                                              fieldToCheck: TableField<*, Int>)
    {
        val actualSetId = db.dsl.select(fieldToCheck)
                .from(RESPONSIBILITY)
                .where(RESPONSIBILITY.ID.eq(returnedIds.responsibility))
                .fetchOneInto(Int::class.java)

        assertThat(actualSetId).isEqualTo(setId)
    }
}