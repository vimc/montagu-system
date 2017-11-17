package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.postgresql.copy.CopyManager
import org.postgresql.core.BaseConnection
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.InconsistentDataError
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.db.*
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.models.BurdenEstimate
import org.vaccineimpact.api.models.BurdenEstimateSet
import org.vaccineimpact.api.models.ResponsibilitySetStatus
import java.beans.ConstructorProperties
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
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
    override fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): Sequence<BurdenEstimateSet>
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        return dsl.select(BURDEN_ESTIMATE_SET.fieldsAsList())
                .fromJoinPath(BURDEN_ESTIMATE_SET, RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId))
                .and(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .fetchSequenceInto()
    }

    override fun addModelRunParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                         description: String, uploader: String, timestamp: Instant)
    {
        val uploadInfo = dsl.newRecord(UPLOAD_INFO).apply{
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
        }

        uploadInfo.store()

        val newParameterSet = this.dsl.newRecord(MODEL_RUN_PARAMETER_SET).apply {
            this.responsibilitySet = responsibilitySetId
            this.description = description
            this.modelVersion = modelVersionId
            this.uploadInfo = uploadInfo.id
        }

        newParameterSet.store()
    }

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
        val countries = getAllCountryIds()

        // The only foreign keys are:
        // * burden_estimate_set, which is the same for every row, and it's the one we just created and know exists
        // * country, which we check below, per row of the CSV (and each row represents multiple rows in the database
        //   so this is an effort saving).
        // * burden_outcome, which we check below (currently we check for every row, but given these are set in the
        //   columns and don't vary by row this could be made more efficient)
        dsl.withoutCheckingForeignKeyConstraints(BURDEN_ESTIMATE) {

            // Currently we write everything to a byte array in memory and then later feed that stream to CopyManager.
            // Obviously this could be made more performant by chaining those two together somehow.
            val data = ByteArrayOutputStream().use { stream ->
                PostgresCopyWriter(stream).use { writer ->
                    for (estimate in estimates)
                    {
                        if (estimate.disease != expectedDisease)
                        {
                            throw InconsistentDataError("Provided estimate lists disease as '${estimate.disease}' but scenario is for disease '$expectedDisease'")
                        }
                        if (estimate.country !in countries)
                        {
                            throw UnknownObjectError(estimate.country, "country")
                        }

                        writer.writeRow(newBurdenEstimateRow(setId, estimate, cohortSizeId, estimate.cohortSize))
                        for (outcome in estimate.outcomes)
                        {
                            val outcomeId = outcomeLookup[outcome.key]
                                    ?: throw UnknownObjectError(outcome.key, "burden-outcome")
                            writer.writeRow(newBurdenEstimateRow(setId, estimate, outcomeId, outcome.value))
                        }
                    }
                }
                stream.toByteArray()
            }

            // We use dsl.connection to drop down from jOOQ to the JDBC level so we can use CopyManager.
            dsl.connection { connection ->
                ByteArrayInputStream(data).use { stream ->
                    val t = BURDEN_ESTIMATE
                    val manager = CopyManager(connection as BaseConnection)
                    manager.copyInto(BURDEN_ESTIMATE, stream, listOf(
                            t.BURDEN_ESTIMATE_SET,
                            t.COUNTRY,
                            t.YEAR,
                            t.AGE,
                            t.STOCHASTIC,
                            t.BURDEN_OUTCOME,
                            t.VALUE
                    ))
                }
            }
        }
    }

    private fun getAllCountryIds() = dsl.select(COUNTRY.ID)
            .from(COUNTRY)
            .fetch()
            .map { it[COUNTRY.ID] }
            .toHashSet()

    private fun newBurdenEstimateRow(
            setId: Int,
            estimate: BurdenEstimate,
            outcomeId: Int,
            outcomeValue: BigDecimal?
    ): List<Any?>
    {
        return listOf(
                setId,
                estimate.country,
                estimate.year,
                estimate.age,
                false, /* stochastic */
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