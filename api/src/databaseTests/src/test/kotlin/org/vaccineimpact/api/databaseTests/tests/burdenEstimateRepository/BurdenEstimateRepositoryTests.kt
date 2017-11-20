package org.vaccineimpact.api.databaseTests.tests

import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqBurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqModellingGroupRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqScenarioRepository
import org.vaccineimpact.api.app.repositories.jooq.JooqTouchstoneRepository
import org.vaccineimpact.api.databaseTests.RepositoryTests
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.direct.*
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneOffset

abstract class BurdenEstimateRepositoryTests : RepositoryTests<BurdenEstimateRepository>()
{
    protected data class ReturnedIds(val modelVersion: Int?, val responsibility: Int, val responsibilitySetId: Int)

    override fun makeRepository(db: JooqContext): BurdenEstimateRepository
    {
        val scenario = JooqScenarioRepository(db.dsl)
        val touchstone = JooqTouchstoneRepository(db.dsl, scenario)

        val modellingGroup = JooqModellingGroupRepository(db.dsl, touchstone, scenario)
        return JooqBurdenEstimateRepository(db.dsl, scenario, touchstone, modellingGroup)
    }

    protected val scenarioId = "scenario-1"
    protected val groupId = "group-1"
    protected val touchstoneId = "touchstone-1"
    protected val modelId = "model-1"
    protected val modelVersion = "version-1"
    protected val username = "some.user"
    protected val timestamp = LocalDateTime.of(2017, Month.JUNE, 13, 12, 30).toInstant(ZoneOffset.UTC)

    protected fun setupDatabase(db: JooqContext, addModel: Boolean = true,
                              responsibilitySetStatus: String = "incomplete"): ReturnedIds
    {
        db.addTouchstone("touchstone", 1, "Touchstone 1", addName = true)
        db.addScenarioDescription(scenarioId, "Test scenario", "Hib3", addDisease = true)
        db.addGroup(groupId, "Test group")
        val modelVersionId = if (addModel)
        {
            db.addModel(modelId, groupId, "Hib3")
            db.addModelVersion(modelId, modelVersion, setCurrent = true)
        }
        else
        {
            null
        }
        val setId = db.addResponsibilitySet(groupId, touchstoneId, responsibilitySetStatus)
        val responsibilityId = db.addResponsibility(setId, touchstoneId, scenarioId)
        db.addUserForTesting(username)
        return ReturnedIds(modelVersionId, responsibilityId, setId)
    }
}