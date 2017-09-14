package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.Configuration
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.JooqContext
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.BurdenEstimateRecord
import org.vaccineimpact.api.models.BurdenEstimate
import java.math.BigDecimal
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
                                      estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        val responsibilityId = getResponsibility(modellingGroup.id, touchstoneId, scenarioId)
        val outcomeLookup = getOutcomesAsLookup()
        val latestModelVersion = dsl.select(MODEL_VERSION.ID)
                .fromJoinPath(MODELLING_GROUP, MODEL, MODEL_VERSION)
                .where(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .and(MODEL.CURRENT.isNull)
                .fetch().firstOrNull()?.value1()
            ?: throw Exception("Modelling group $groupId does not have any models/model versions in the database")

        val setId = addSet(responsibilityId, uploader, timestamp, latestModelVersion)
        val cohortSizeId = outcomeLookup["cohort_size"]
            ?: throw DatabaseContentsError("Expected a value with code 'cohort_size' in burden_outcome table")
        addEstimatesToSet(estimates, setId, outcomeLookup, cohortSizeId)
        return setId
    }

    private fun addEstimatesToSet(estimates: List<BurdenEstimate>, setId: Int,
                                  outcomeLookup: Map<String, Int>, cohortSizeId: Int)
    {
        val records = estimates.flatMap { estimate ->
            val cohortSize = newBurdenEstimateRecord(setId, estimate, cohortSizeId,
                    BigDecimal.valueOf(estimate.cohortSize.toLong())
            )
            val otherOutcomes = estimate.outcomes.map { outcome ->
                val outcomeId = outcomeLookup[outcome.key]
                    ?: throw UnknownObjectError(outcome.key, "burden-outcome")
                newBurdenEstimateRecord(setId, estimate, outcomeId, outcome.value)
            }
            listOf(cohortSize) + otherOutcomes
        }
        dsl.batchStore(records).execute()
    }

    private fun newBurdenEstimateRecord(
            setId: Int,
            estimate: BurdenEstimate,
            outcomeId: Int,
            outcomeValue: BigDecimal?
    ): BurdenEstimateRecord
    {
        return dsl.newRecord(BURDEN_ESTIMATE).apply {
            burdenEstimateSet = setId
            country = estimate.country
            year = estimate.year
            age = estimate.age
            stochastic = false
            burdenOutcome = outcomeId
            value = outcomeValue
        }
    }

    private fun addSet(responsibilityId: Int, uploader: String, timestamp: Instant, modelVersion: Int): Int
    {
        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.modelVersion = modelVersion
            this.responsibility = responsibilityId
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
            this.runInfo = "Not provided"
            this.interpolated = false
        }
        setRecord.insert()
        return setRecord.id
    }

    private fun getOutcomesAsLookup(): Map<String, Int>
    {
        return dsl.select(BURDEN_OUTCOME.CODE, BURDEN_OUTCOME.ID)
                .from(BURDEN_OUTCOME)
                .fetch()
                .intoMap(BURDEN_OUTCOME.CODE, BURDEN_OUTCOME.ID)
    }

    private fun getResponsibility(groupId: String, touchstoneId: String, scenarioId: String): Int
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY.ID)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()?.value1()
                ?: findMissingObjects(touchstoneId, scenarioId)
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