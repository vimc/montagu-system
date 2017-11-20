package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.addBurdenEstimateProblem
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addUserForTesting
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

class RetrieveBurdenEstimatesTests : BurdenEstimateRepositoryTests()
{
    @Test
    fun `can retrieve burden estimate sets`()
    {
        val otherUser = "some.other.user"
        var setA = 0
        var setB = 0
        val before = Instant.now()
        given { db ->
            val ids = setupDatabase(db)
            val modelVersionId = ids.modelVersion!!
            db.addUserForTesting(otherUser)
            setA = db.addBurdenEstimateSet(ids.responsibility, modelVersionId, username)
            setB = db.addBurdenEstimateSet(ids.responsibility, modelVersionId, "some.other.user")
            db.addBurdenEstimateProblem("some problem", setB)
        } check { repo ->
            val after = Instant.now()
            val sets = repo.getBurdenEstimateSets(groupId, touchstoneId, scenarioId).toList()
            val a = sets.single { it.id == setA }
            Assertions.assertThat(a.uploadedBy).isEqualTo(username)
            Assertions.assertThat(a.uploadedOn).isGreaterThan(before)
            Assertions.assertThat(a.uploadedOn).isLessThan(after)
            Assertions.assertThat(a.problems).isEmpty()

            val b = sets.single { it.id == setB }
            Assertions.assertThat(b.uploadedBy).isEqualTo("some.other.user")
            Assertions.assertThat(b.uploadedOn).isGreaterThan(a.uploadedOn)
            Assertions.assertThat(b.uploadedOn).isLessThan(after)
            Assertions.assertThat(b.problems).hasSameElementsAs(listOf("some problem"))
        }
    }

    @Test
    fun `can retrieve burden estimate set type`()
    {
        var setA = 0
        var setB = 0
        var setC = 0
        var setD = 0
        given { db ->
            val ids = setupDatabase(db)
            setA = addBurdenEstimateSet(db, ids, setType = "central-unknown", setTypeDetails = "unknown")
            setB = addBurdenEstimateSet(db, ids, setType = "central-single-run", setTypeDetails = null)
            setC = addBurdenEstimateSet(db, ids, setType = "central-averaged", setTypeDetails = "mean")
            setD = addBurdenEstimateSet(db, ids, setType = "stochastic", setTypeDetails = null)
        } check { repo ->
            val sets = repo.getBurdenEstimateSets(groupId, touchstoneId, scenarioId)
            checkSetHasExpectedType(sets, setA, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_UNKNOWN, "unknown"))
            checkSetHasExpectedType(sets, setB, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_SINGLE_RUN, null))
            checkSetHasExpectedType(sets, setC, BurdenEstimateSetType(BurdenEstimateSetTypeCode.CENTRAL_AVERAGED, "mean"))
            checkSetHasExpectedType(sets, setD, BurdenEstimateSetType(BurdenEstimateSetTypeCode.STOCHASTIC, null))
        }
    }

    private fun checkSetHasExpectedType(sets: List<BurdenEstimateSet>, setId: Int, expectedType: BurdenEstimateSetType)
    {
        val set = sets.singleOrNull { it.id == setId }
        assertThat(set?.type).isEqualTo(expectedType)
    }

    private fun addBurdenEstimateSet(
            db: JooqContext, ids: ReturnedIds, username: String? = null,
            setType: String = "central-single-run", setTypeDetails: String? = null
    ): Int
    {
        return db.addBurdenEstimateSet(
                ids.responsibility,
                ids.modelVersion!!,
                username ?: this.username,
                setType = setType, setTypeDetails = setTypeDetails
        )
    }
}