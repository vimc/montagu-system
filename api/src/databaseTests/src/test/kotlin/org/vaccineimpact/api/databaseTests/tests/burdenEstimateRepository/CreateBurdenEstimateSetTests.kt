package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.db.Tables.RESPONSIBILITY
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import org.vaccineimpact.api.models.CreateBurdenEstimateSet

class CreateBurdenEstimateSetTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can create burden estimate set with empty status`()
    {
        var returnedIds: ReturnedIds? = null
        var setId: Int? = null

        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            setId = repo.createBurdenEstimateSet(returnedIds!!.responsibility, returnedIds!!.modelVersion!!,
                    defaultProperties, username, timestamp)
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
        var returnedIds: ReturnedIds? = null
        given { db ->
            returnedIds = setupDatabaseWithModelRunParameterSet(db)
        } makeTheseChanges { repo ->
            repo.createBurdenEstimateSet(returnedIds!!.responsibility, returnedIds!!.modelVersion!!,
                    properties, username, timestamp)
        } andCheck { repo ->
            val set = repo.getBurdenEstimateSets(groupId, touchstoneVersionId, scenarioId).single()
            assertThat(set.type).isEqualTo(properties.type)
        }
    }

    @Test
    fun `does not update current estimate set on creation`()
    {
        var returnedIds: ReturnedIds? = null
        var setId: Int? = null
        given { db ->
            returnedIds = setupDatabase(db)
        } makeTheseChanges { repo ->
            setId = repo.createBurdenEstimateSet(returnedIds!!.responsibility, returnedIds!!.modelVersion!!,
                    defaultProperties, username, timestamp)
        } andCheckDatabase { db ->
            val actualSetId = db.dsl.select(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET)
                    .from(RESPONSIBILITY)
                    .where(RESPONSIBILITY.ID.eq(returnedIds!!.responsibility))
                    .fetchOneInto(Int::class.java)

            assertThat(actualSetId).isNotEqualTo(setId)
        }
    }

}