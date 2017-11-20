package org.vaccineimpact.api.databaseTests.tests.burdenEstimateRepository

import org.assertj.core.api.Assertions
import org.junit.Test
import org.vaccineimpact.api.databaseTests.tests.BurdenEstimateRepositoryTests
import org.vaccineimpact.api.db.direct.addBurdenEstimateProblem
import org.vaccineimpact.api.db.direct.addBurdenEstimateSet
import org.vaccineimpact.api.db.direct.addUserForTesting
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
}