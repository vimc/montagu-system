package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fieldsAsList
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.models.BurdenEstimateSet
import java.sql.Timestamp
import java.time.Instant

class JooqBurdenEstimateRepository(
        db: JooqContext,
        config: Configuration,
        private val scenarioRepository: ScenarioRepository,
        override val touchstoneRepository: TouchstoneRepository,
        private val modellingGroupRepository: ModellingGroupRepository
) : JooqRepository(db, config), BurdenEstimateRepository
{
    override fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                      set: BurdenEstimateSet, uploader: String, timestamp: Instant): Int
    {
        val responsibilityId = getResponsibility(groupId, touchstoneId, scenarioId)
        val outcomeLookup = getOutcomesAsLookup()

        val setId = addSet(responsibilityId, uploader, timestamp)
        addEstimatesToSet(set, setId, outcomeLookup)
        return setId
    }

    private fun addEstimatesToSet(set: BurdenEstimateSet, setId: Int?, outcomeLookup: Map<Any, Int>)
    {
        val estimates = set.estimates.flatMap { row ->
            row.outcomes.map { outcome ->
                dsl.newRecord(BURDEN_ESTIMATE).apply {
                    burdenEstimateSet = setId
                    country = row.country
                    year = row.year
                    age = row.age
                    stochastic = false
                    burdenOutcome = outcomeLookup[outcome.value]
                    value = outcome.value
                }
            }
        }
        dsl.batchStore(estimates).execute()
    }

    private fun addSet(responsibilityId: Int, uploader: String, timestamp: Instant): Int
    {
        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.responsibility = responsibilityId
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
        }
        setRecord.insert()
        return setRecord.id
    }

    private fun getOutcomesAsLookup(): Map<Any, Int>
    {
        val outcomeLookup = dsl.select(BURDEN_OUTCOME.fieldsAsList())
                .from(BURDEN_OUTCOME)
                .fetch()
                .associateBy({ it[BURDEN_OUTCOME.name] }, { it[BURDEN_OUTCOME.ID] })
        return outcomeLookup
    }

    private fun getResponsibility(groupId: String, touchstoneId: String, scenarioId: String): Int
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val responsibilityId = dsl.select(RESPONSIBILITY.ID)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_COVERAGE_SET)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()?.value1()
                ?: findMissingObjects(touchstoneId, scenarioId)
        return responsibilityId
    }

    private fun <T> findMissingObjects(touchstoneId: String, scenarioId: String): T
    {
        touchstoneRepository.touchstones.get(touchstoneId)
        scenarioRepository.checkScenarioDescriptionExists(scenarioId)
        // Note this is where the scenario_description *does* exist, but
        // the group is not responsible for it in this touchstone
        throw UnknownObjectError(scenarioId, "responsibility")
    }
}