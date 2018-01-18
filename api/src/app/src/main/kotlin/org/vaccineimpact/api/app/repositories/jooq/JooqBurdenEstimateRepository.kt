package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.DatabaseContentsError
import org.vaccineimpact.api.app.errors.OperationNotAllowedError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.repositories.*
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.StochasticBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.db.AnnexJooqContext
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.serialization.FlexibleDataTable
import java.beans.ConstructorProperties
import java.sql.Timestamp
import java.time.Instant

private data class ResponsibilityInfo
@ConstructorProperties("id", "disease", "status", "setId")
constructor(val id: Int, val disease: String, val setStatus: String, val setId: Int)

class JooqBurdenEstimateRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        override val touchstoneRepository: TouchstoneRepository,
        private val modellingGroupRepository: ModellingGroupRepository,
        private val mapper: BurdenMappingHelper = BurdenMappingHelper(),
        centralBurdenEstimateWriter: BurdenEstimateWriter? = null,
        stochasticBurdenEstimateWriter: StochasticBurdenEstimateWriter? = null
) : JooqRepository(dsl), BurdenEstimateRepository
{
    private val centralBurdenEstimateWriter: BurdenEstimateWriter = centralBurdenEstimateWriter ?:
            CentralBurdenEstimateWriter(dsl)

    private val stochasticBurdenEstimateWriter: StochasticBurdenEstimateWriter = stochasticBurdenEstimateWriter ?:
            StochasticBurdenEstimateWriter(dsl, { AnnexJooqContext().dsl })

    override fun getModelRunParameterSets(groupId: String, touchstoneId: String): List<ModelRunParameterSet>
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val setId = getResponsibilitySetId(groupId, touchstoneId)

        return dsl.select(
                MODEL_RUN_PARAMETER_SET.ID,
                MODEL_RUN_PARAMETER_SET.DESCRIPTION,
                MODEL.ID.`as`("model"),
                UPLOAD_INFO.UPLOADED_BY,
                UPLOAD_INFO.UPLOADED_ON,
                MODEL.DISEASE)
                .fromJoinPath(MODEL_RUN_PARAMETER_SET, UPLOAD_INFO)
                .join(MODEL)
                .on(MODEL.CURRENT_VERSION.eq(MODEL_RUN_PARAMETER_SET.MODEL_VERSION))
                .where(MODEL.MODELLING_GROUP.eq(modellingGroup.id))
                .and(MODEL.IS_CURRENT)
                .and(MODEL_RUN_PARAMETER_SET.RESPONSIBILITY_SET.eq(setId))
                .orderBy(MODEL.DISEASE.asc(), UPLOAD_INFO.UPLOADED_ON.desc())
                .fetchInto(ModelRunParameterSet::class.java)
    }

    override fun getBurdenEstimateSet(setId: Int): BurdenEstimateSet
    {
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(
                table.ID,
                table.UPLOADED_ON,
                table.UPLOADED_BY,
                table.SET_TYPE,
                table.SET_TYPE_DETAILS,
                table.STATUS,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .where(table.ID.eq(setId))
                .fetch()

        return mapper.mapBurdenEstimateSets(records).singleOrNull()
                ?: throw UnknownObjectError(setId, "burden-estimate-set")
    }

    override fun getBurdenEstimateSets(groupId: String, touchstoneId: String, scenarioId: String): List<BurdenEstimateSet>
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(
                table.ID,
                table.UPLOADED_ON,
                table.UPLOADED_BY,
                table.SET_TYPE,
                table.SET_TYPE_DETAILS,
                table.STATUS,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(RESPONSIBILITY).on(RESPONSIBILITY.ID.eq(table.RESPONSIBILITY))
                .joinPath(RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneId))
                .and(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .fetch()

        return mapper.mapBurdenEstimateSets(records)
    }

    override fun addModelRunParameterSet(groupId: String, touchstoneId: String, disease: String,
                                         description: String, modelRuns: List<ModelRun>,
                                         uploader: String, timestamp: Instant): Int
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val modelVersion = getlatestModelVersion(modellingGroup.id, disease)

        // We aren't checking whether the provided disease is associated with a scenario in this
        // responsibility set but the intention is to refactor the data model so that a responsibility set
        // is tied to a single disease, which will make this easier to do down the line
        val setId = getResponsibilitySetId(modellingGroup.id, touchstoneId)

        return addModelRunParameterSet(setId,
                modelVersion, description, modelRuns, uploader, timestamp)
    }

    fun addModelRunParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                description: String, modelRuns: List<ModelRun>,
                                uploader: String, timestamp: Instant): Int
    {
        val uploadInfoId = addUploadInfo(uploader, timestamp)
        val parameterSetId = addParameterSet(responsibilitySetId, modelVersionId, description, uploadInfoId)
        val parameterLookup = addParameters(modelRuns, parameterSetId)

        for (run in modelRuns)
        {
            addModelRun(run, parameterSetId, parameterLookup)
        }

        return parameterSetId
    }

    override fun getModelRunParameterSet(setId: Int): FlexibleDataTable<ModelRun>
    {
        val sequence = getModelRunParametersSequence(setId)
        val headers = getModelRunParametersHeaders(setId)

        return FlexibleDataTable.new(sequence, headers)
    }

    private fun getModelRunParametersHeaders(setId: Int): List<String>
    {
        val records = dsl.select(
                MODEL_RUN_PARAMETER.KEY
        )
                .from(MODEL_RUN_PARAMETER)
                .where(MODEL_RUN_PARAMETER.MODEL_RUN_PARAMETER_SET.eq(setId))
                .fetchInto(String::class.java)
        return records
    }

    private fun getModelRunParametersSequence(setId: Int): Sequence<ModelRun>
    {
        return dsl.select(
                MODEL_RUN_PARAMETER_VALUE.ID,
                MODEL_RUN_PARAMETER.KEY,
                MODEL_RUN.RUN_ID,
                MODEL_RUN_PARAMETER_VALUE.VALUE
        )
                .fromJoinPath(MODEL_RUN_PARAMETER, MODEL_RUN_PARAMETER_VALUE, MODEL_RUN)
                .where(MODEL_RUN_PARAMETER.MODEL_RUN_PARAMETER_SET.eq(setId))
                .fetch()
                .map { mapper.mapModelRunParameter(it) }
                .groupBy { it.run_id }
                .map { mapper.mapModelRun(it.key, it.value)}
                .asSequence()
    }

    private fun addUploadInfo(uploader: String, timestamp: Instant): Int
    {
        val uploadInfo = dsl.newRecord(UPLOAD_INFO).apply {
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
        }

        uploadInfo.store()

        return uploadInfo.id
    }

    private fun addParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                description: String, uploadInfoId: Int): Int
    {
        val newParameterSet = this.dsl.newRecord(MODEL_RUN_PARAMETER_SET).apply {
            this.responsibilitySet = responsibilitySetId
            this.description = description
            this.modelVersion = modelVersionId
            this.uploadInfo = uploadInfoId
        }

        newParameterSet.store()

        return newParameterSet.id
    }

    private fun addParameters(modelRuns: List<ModelRun>, modelRunParameterSetId: Int): Map<String, Int>
    {
        if (!modelRuns.any())
        {
            throw BadRequest("No model runs provided")
        }

        val parameters = modelRuns.first().parameterValues.keys
        return parameters.associateBy({ it }, {
            val record = this.dsl.newRecord(MODEL_RUN_PARAMETER).apply {
                this.key = it
                this.modelRunParameterSet = modelRunParameterSetId
            }
            record.store()
            record.id
        })
    }

    private fun addModelRun(run: ModelRun, modelRunParameterSetId: Int, parameterIds: Map<String, Int>)
    {

        val record = this.dsl.newRecord(MODEL_RUN).apply {
            this.runId = run.runId
            this.modelRunParameterSet = modelRunParameterSetId
        }

        record.store()

        run.parameterValues.map {
            this.dsl.newRecord(MODEL_RUN_PARAMETER_VALUE).apply {
                this.modelRun = record.internalId
                this.modelRunParameter = parameterIds[it.key]
                this.value = it.value
            }.store()
        }
    }

    override fun populateBurdenEstimateSet(setId: Int, groupId: String, touchstoneId: String, scenarioId: String,
                                           estimates: Sequence<BurdenEstimateWithRunId>)
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        val responsibilityInfo = getResponsibilityInfo(modellingGroup.id, touchstoneId, scenarioId)

        val set = getBurdenEstimateSet(setId)
        val type = set.type.type

        if (set.status != BurdenEstimateSetStatus.EMPTY)
        {
            throw OperationNotAllowedError("This burden estimate set already contains estimates." +
                    " You must create a new set if you want to upload any new estimates.")
        }

        if (type == BurdenEstimateSetTypeCode.STOCHASTIC)
        {
            stochasticBurdenEstimateWriter.addEstimatesToSet(setId, estimates, responsibilityInfo.disease)
        }
        else
        {
            centralBurdenEstimateWriter.addEstimatesToSet(setId, estimates, responsibilityInfo.disease)
        }

        dsl.update(Tables.BURDEN_ESTIMATE_SET)
                .set(Tables.BURDEN_ESTIMATE_SET.STATUS, "complete")
                .where(Tables.BURDEN_ESTIMATE_SET.ID.eq(setId))
                .execute()

        updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId, type)
    }

    override fun createBurdenEstimateSet(groupId: String, touchstoneId: String, scenarioId: String,
                                         properties: CreateBurdenEstimateSet,
                                         uploader: String, timestamp: Instant): Int
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

        val modelRunParameterSetId = properties.modelRunParameterSetId
        if (modelRunParameterSetId != null)
        {
            dsl.select(MODEL_RUN_PARAMETER_SET.ID)
                    .from(MODEL_RUN_PARAMETER_SET)
                    .where(MODEL_RUN_PARAMETER_SET.ID.eq(modelRunParameterSetId))
                    .fetch()
                    .singleOrNull() ?: throw UnknownObjectError(modelRunParameterSetId, "model run paramater set")
        }

        val latestModelVersion = getlatestModelVersion(modellingGroup.id, responsibilityInfo.disease)

        val setId = addSet(responsibilityInfo.id, uploader, timestamp, latestModelVersion, properties)
        updateCurrentBurdenEstimateSet(responsibilityInfo.id, setId, properties.type.type)

        return setId
    }

    override fun clearBurdenEstimateSet(setId: Int, groupId: String, touchstoneId: String, scenarioId: String)
    {
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        getResponsibilityInfo(modellingGroup.id, touchstoneId, scenarioId)
        val set = getBurdenEstimateSet(setId)

        if (set.status == BurdenEstimateSetStatus.COMPLETE)
        {
            throw OperationNotAllowedError("You cannot clear a burden estimate set which is marked as 'complete'.")
        }

        val type = set.type.type
        if (type == BurdenEstimateSetTypeCode.STOCHASTIC)
        {
            stochasticBurdenEstimateWriter.clearEstimateSet(setId)
        }
        else
        {
            centralBurdenEstimateWriter.clearEstimateSet(setId)
        }
    }

    private fun getlatestModelVersion(groupId: String, disease: String): Int
    {
        return dsl.select(MODEL_VERSION.ID)
                .fromJoinPath(MODELLING_GROUP, MODEL)
                .join(MODEL_VERSION)
                .on(MODEL_VERSION.ID.eq(MODEL.CURRENT_VERSION))
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(MODEL.DISEASE.eq(disease))
                .and(MODEL.IS_CURRENT)
                .fetch().singleOrNull()?.value1()
                ?: throw DatabaseContentsError("Modelling group $groupId does not have any models/model versions in the database")

    }

    private fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int, type: BurdenEstimateSetTypeCode)
    {
        val field = if (type.isStochastic())
        {
            RESPONSIBILITY.CURRENT_STOCHASTIC_BURDEN_ESTIMATE_SET
        }
        else
        {
            RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET
        }

        dsl.update(RESPONSIBILITY)
                .set(field, setId)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .execute()
    }

    private fun addSet(responsibilityId: Int, uploader: String, timestamp: Instant,
                       modelVersion: Int, properties: CreateBurdenEstimateSet): Int
    {
        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.modelVersion = modelVersion
            this.responsibility = responsibilityId
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
            this.runInfo = "Not provided"
            this.interpolated = false
            this.status = "empty"
            this.setType = mapper.mapEnum(properties.type.type)
            this.setTypeDetails = properties.type.details
            this.modelRunParameterSet = properties.modelRunParameterSetId
        }
        setRecord.insert()
        return setRecord.id
    }

    private fun getResponsibilityInfo(groupId: String, touchstoneId: String, scenarioId: String): ResponsibilityInfo
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY.ID, SCENARIO_DESCRIPTION.DISEASE, RESPONSIBILITY_SET.STATUS, RESPONSIBILITY_SET.ID.`as`("setId"))
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()
                ?.into(ResponsibilityInfo::class.java)
                ?: findMissingObjects(touchstoneId, scenarioId)
    }

    private fun getResponsibilitySetId(groupId: String, touchstoneId: String): Int
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY_SET.ID)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneId))
                .fetchOneInto(Int::class.java)
                ?: throw UnknownObjectError(touchstoneId, "touchstone")
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