package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.ResponsibilitySetStatus
import java.beans.ConstructorProperties
import java.math.BigDecimal
import java.sql.Timestamp
import java.time.Instant

private data class ResponsibilityInfo
@ConstructorProperties("id", "disease", "status")
constructor(val id: Int, val disease: String, val setStatus: String)

class JooqBurdenEstimateRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        override val touchstoneRepository: TouchstoneRepository,
        private val modellingGroupRepository: ModellingGroupRepository
) : JooqRepository(dsl), BurdenEstimateRepository
{
    override fun addBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                      estimates: List<BurdenEstimate>, uploader: String, timestamp: Instant): Int
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        val responsibilityInfo = getResponsibilityInfo(modellingGroup.id, touchstoneId, scenarioId)
        val status = responsibilityInfo.setStatus.toLowerCase()

        if (status == ResponsibilitySetStatus.SUBMITTED.name.toLowerCase())
        {
            throw OperationNotAllowedError("The burden estimates uploaded for this touchstone have been submitted " +
                    "for review. You cannot upload any new estimates.")
        }

        if (status == ResponsibilitySetStatus.APPROVED.name.toLowerCase())
        {
            throw OperationNotAllowedError("The burden estimates uploaded for this touchstone have been reviewed" +
                    " and approved. You cannot upload any new estimates.")
        }

        val outcomeLookup = getOutcomesAsLookup()
        val latestModelVersion = dsl.select(MODEL_VERSION.ID)
                .fromJoinPath(MODELLING_GROUP, MODEL)
                .join(MODEL_VERSION)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .where(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .and(MODEL.DISEASE.eq(responsibilityInfo.disease))
                .and(MODEL.IS_CURRENT)
                .fetch().singleOrNull()?.value1()
            ?: throw DatabaseContentsError("Modelling group $groupId does not have any models/model versions in the database")

        val setId = addSet(responsibilityInfo.id, uploader, timestamp, latestModelVersion)
        val cohortSizeId = outcomeLookup["cohort_size"]
            ?: throw DatabaseContentsError("Expected a value with code 'cohort_size' in burden_outcome table")

        addEstimatesToSet(estimates, setId, outcomeLookup, cohortSizeId, responsibilityInfo.disease)

        updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId)

        return setId
    }

    private fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int)
    {
        dsl.update(RESPONSIBILITY)
                .set(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET, setId)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .execute()
    }

    private fun addEstimatesToSet(estimates: List<BurdenEstimate>, setId: Int,
                                  outcomeLookup: Map<String, Int>, cohortSizeId: Int,
                                  expectedDisease: String)
    {
        dsl.query("select top 0 * into #temp from burden_estimate").execute()

        val records = estimates.asSequence().flatMap { estimate ->
            if (estimate.disease != expectedDisease)
            {
                throw InconsistentDataError("Provided estimate lists disease as '${estimate.disease}' but scenario is for disease '$expectedDisease'")
            }
            val cohortSize = newBurdenEstimateRecord(setId, estimate, cohortSizeId,
                    estimate.cohortSize)

            val otherOutcomes = estimate.outcomes.map { outcome ->
                val outcomeId = outcomeLookup[outcome.key]
                        ?: throw UnknownObjectError(outcome.key, "burden-outcome")
                newBurdenEstimateRecord(setId, estimate, outcomeId, outcome.value)
            }
            val outcomes = listOf(cohortSize) + otherOutcomes
            outcomes.asSequence()
        }
        val t = BURDEN_ESTIMATE
        val iterator = records.iterator()
        var statement = dsl.insertInto("#temp",
                t.BURDEN_ESTIMATE_SET, t.COUNTRY, t.YEAR, t.AGE, t.STOCHASTIC, t.BURDEN_OUTCOME, t.VALUE)
        while (iterator.hasNext())
        {
            val row = iterator.next()
            statement.values(row[0] as Int, row[1] as String, row[2] as Int, row[3] as Int, row[4] as Boolean, row[5] as Int, row[6] as BigDecimal?)
        }
        statement.execute()
    }

    private fun newBurdenEstimateRecord(
            setId: Int,
            estimate: BurdenEstimate,
            outcomeId: Int,
            outcomeValue: BigDecimal?
    ): Array<Any?>
    {
        return arrayOf(
            setId,
            estimate.country,
            estimate.year,
            estimate.age,
            false,
            outcomeId,
            outcomeValue
        )
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

    private fun getResponsibilityInfo(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityInfo
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY.ID, SCENARIO_DESCRIPTION.DISEASE, RESPONSIBILITY_SET.STATUS)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()
                ?.into(ResponsibilityInfo::class.java)
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