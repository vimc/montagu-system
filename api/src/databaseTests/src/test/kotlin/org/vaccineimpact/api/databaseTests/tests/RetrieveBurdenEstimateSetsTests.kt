package org.vaccineimpact.api.databaseTests.tests

import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqBurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.BurdenEstimateSetType
import org.vaccineimpact.api.models.BurdenEstimateSetTypeCode
import java.time.Instant

class RetrieveBurdenEstimateSetsTests : RepositoryTests<BurdenEstimateRepository>()
{
    private data class ReturnedIds(val modelVersion: Int, val responsibility: Int)

    private val scenarioId = "scenario-1"
    private val groupId = "group-1"
    private val touchstoneId = "touchstone-1"
    private val modelId = "model-1"
    private val modelVersion = "version-1"
    private val username = "some.user"

    override fun makeRepository(db: JooqContext): BurdenEstimateRepository
    {
        val scenario = JooqScenarioRepository(db.dsl)
        val touchstone = JooqTouchstoneRepository(db.dsl, scenario)

        val modellingGroup = JooqModellingGroupRepository(db.dsl, touchstone, scenario)
        return JooqBurdenEstimateRepository(db.dsl, scenario, touchstone, modellingGroup)
    }

    @Test
    fun `can retrieve burden estimate sets`()
    {
        val otherUser = "some.other.user"
        var setA = 0
        var setB = 0
        val before = Instant.now()
        given { db ->
            val ids = setupDatabase(db)
            db.addUserForTesting(otherUser)
            setA = addBurdenEstimateSet(db, ids, username)
            setB = addBurdenEstimateSet(db, ids, "some.other.user")
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
            setA = addBurdenEstimateSet(db, ids, setType = "central_unknown", setTypeDetails = "unknown")
            setB = addBurdenEstimateSet(db, ids, setType = "central_single_run", setTypeDetails = null)
            setC = addBurdenEstimateSet(db, ids, setType = "central_averaged", setTypeDetails = "mean")
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
            setType: String = "central_single_run", setTypeDetails: String? = null
    ): Int
    {
        return db.addBurdenEstimateSet(
                ids.responsibility,
                ids.modelVersion,
                username ?: this.username,
                setType = setType, setTypeDetails = setTypeDetails
        )
    }

    private fun setupDatabase(db: JooqContext, responsibilitySetStatus: String = "incomplete")
            : ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        db.addModel(modelId, groupId, "Hib3")
        val modelVersionId = db.addModelVersion(modelId, modelVersion, setCurrent = true)
        val setId = db.addResponsibilitySet(groupId, touchstoneId, responsibilitySetStatus)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)
        return ReturnedIds(modelVersionId, responsibilityId)
    }
}