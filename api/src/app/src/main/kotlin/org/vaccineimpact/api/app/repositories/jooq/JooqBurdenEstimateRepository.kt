package org.vaccineimpact.api.app.repositories.jooq

import org.jooq.DSLContext
import org.jooq.JoinType
import org.jooq.impl.DSL.sum
import org.vaccineimpact.api.app.errors.BadRequest
import org.vaccineimpact.api.app.errors.InvalidOperationError
import org.vaccineimpact.api.app.errors.UnknownObjectError
import org.vaccineimpact.api.app.models.BurdenEstimateOutcome
import org.vaccineimpact.api.app.repositories.BurdenEstimateRepository
import org.vaccineimpact.api.app.repositories.ModellingGroupRepository
import org.vaccineimpact.api.app.repositories.ScenarioRepository
import org.vaccineimpact.api.app.repositories.TouchstoneRepository
import org.vaccineimpact.api.app.repositories.burdenestimates.BurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.burdenestimates.CentralBurdenEstimateWriter
import org.vaccineimpact.api.app.repositories.jooq.mapping.BurdenMappingHelper
import org.vaccineimpact.api.db.Tables
import org.vaccineimpact.api.db.Tables.*
import org.vaccineimpact.api.db.fetchSequence
import org.vaccineimpact.api.db.fromJoinPath
import org.vaccineimpact.api.db.joinPath
import org.vaccineimpact.api.db.tables.records.BurdenEstimateRecord
import org.vaccineimpact.api.models.*
import org.vaccineimpact.api.models.expectations.RowLookup
import org.vaccineimpact.api.serialization.FlexibleDataTable
import java.beans.ConstructorProperties
import java.sql.Timestamp
import java.time.Instant

data class ResponsibilityInfo
@ConstructorProperties("id", "disease", "status", "setId")
constructor(val id: Int, val disease: String, val setStatus: String, val setId: Int)

class JooqBurdenEstimateRepository(
        dsl: DSLContext,
        private val scenarioRepository: ScenarioRepository,
        override val touchstoneRepository: TouchstoneRepository,
        private val modellingGroupRepository: ModellingGroupRepository,
        private val mapper: BurdenMappingHelper = BurdenMappingHelper(),
        centralBurdenEstimateWriter: CentralBurdenEstimateWriter? = null
) : JooqRepository(dsl), BurdenEstimateRepository
{
    override fun getEstimates(setId: Int, responsibilityId: Int,
                              outcomeIds: List<Short>,
                              burdenEstimateGrouping: BurdenEstimateGrouping):
            BurdenEstimateDataSeries
    {
        // check set belongs to this responsibility
        dsl.select()
                .from(BURDEN_ESTIMATE_SET)
                .where(BURDEN_ESTIMATE_SET.RESPONSIBILITY.eq(responsibilityId))
                .and(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .singleOrNull()
                ?: throw UnknownObjectError(setId, BurdenEstimateSet::class)

        val data = dsl.select(BURDEN_ESTIMATE.YEAR, BURDEN_ESTIMATE.AGE, sum(BURDEN_ESTIMATE.VALUE).`as`("value"))
                .from(BURDEN_ESTIMATE)
                .where(BURDEN_ESTIMATE.BURDEN_ESTIMATE_SET.eq(setId))
                .and(BURDEN_ESTIMATE.BURDEN_OUTCOME.`in`(outcomeIds))
                .groupBy(BURDEN_ESTIMATE.YEAR, BURDEN_ESTIMATE.AGE)
                .orderBy(BURDEN_ESTIMATE.YEAR, BURDEN_ESTIMATE.AGE)
                .fetchInto(BurdenEstimateDataPoint::class.java)
                .groupBy { if (burdenEstimateGrouping == BurdenEstimateGrouping.AGE) it.age else it.year }

        return BurdenEstimateDataSeries(burdenEstimateGrouping, data)
    }

    override fun getBurdenOutcomeIds(matching: String): List<Short>
    {
        return dsl.select(BURDEN_OUTCOME.ID)
                .from(BURDEN_OUTCOME)
                .where(BURDEN_OUTCOME.CODE.like("%$matching%"))
                .fetchInto(Short::class.java)
    }

    private fun getCountriesAsLookup(): Map<Short, String> = dsl.select(Tables.COUNTRY.ID, Tables.COUNTRY.NID)
            .from(Tables.COUNTRY)
            .fetch()
            .intoMap(Tables.COUNTRY.NID, Tables.COUNTRY.ID)

    override fun validateEstimates(set: BurdenEstimateSet, expectedRowMap: RowLookup): RowLookup
    {
        val countries = getCountriesAsLookup()
        dsl.select(BURDEN_ESTIMATE.COUNTRY, BURDEN_ESTIMATE.AGE, BURDEN_ESTIMATE.YEAR)
                .from(BURDEN_ESTIMATE)
                .where(BURDEN_ESTIMATE.BURDEN_ESTIMATE_SET.eq(set.id)).stream().use { stream ->
                    stream.forEach { validate(it.into(BURDEN_ESTIMATE), countries, expectedRowMap) }
                }

        return expectedRowMap
    }

    private fun validate(r: BurdenEstimateRecord, countries: Map<Short, String>, expectedRows: RowLookup)
    {
        val countryId = countries[r.country]
        val ages = expectedRows[countryId]
                ?: throw BadRequest("We are not expecting data for country $countryId")

        val years = ages[r.age]
                ?: throw BadRequest("We are not expecting data for age ${r.age}")

        if (!years.containsKey(r.year))
        {
            throw BadRequest("We are not expecting data for age ${r.age} and year ${r.year}")
        }

        expectedRows[countryId]!![r.age]!![r.year] = true
    }

    override val centralEstimateWriter: BurdenEstimateWriter = centralBurdenEstimateWriter
            ?: CentralBurdenEstimateWriter(dsl)

    override fun getModelRunParameterSets(groupId: String, touchstoneVersionId: String): List<ModelRunParameterSet>
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)
        val setId = getResponsibilitySetId(groupId, touchstoneVersionId)

        return dsl.select(
                MODEL_RUN_PARAMETER_SET.ID,
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

    override fun checkModelRunParameterSetExists(modelRunParameterSetId: Int, groupId: String, touchstoneVersionId: String)
    {
        //Check that the parameter set exists and belongs to the specified group and touchstone
        getModelRunParameterSets(groupId, touchstoneVersionId)
                .filter { s -> s.id == modelRunParameterSetId }
                .firstOrNull() ?: throw UnknownObjectError(modelRunParameterSetId, ModelRunParameterSet::class)
    }

    override fun getBurdenEstimateSetForResponsibility(setId: Int, responsibilityId: Int): BurdenEstimateSet
    {
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(
                table.ID,
                table.UPLOADED_ON,
                table.UPLOADED_BY,
                table.SET_TYPE,
                table.SET_TYPE_DETAILS,
                table.STATUS,
                table.RESPONSIBILITY,
                table.ORIGINAL_FILENAME,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .where(table.ID.eq(setId).and(table.RESPONSIBILITY.eq(responsibilityId)))
                .fetch()

        return mapper.mapBurdenEstimateSets(records).singleOrNull()
                ?: throw UnknownObjectError(setId, "burden-estimate-set")
    }

    override fun getBurdenEstimateSet(groupId: String, touchstoneVersionId: String, scenarioId: String,
                                      burdenEstimateSetId: Int): BurdenEstimateSet
    {
        val table = BURDEN_ESTIMATE_SET
        val records = dsl.select(
                table.ID,
                table.UPLOADED_ON,
                table.UPLOADED_BY,
                table.SET_TYPE,
                table.SET_TYPE_DETAILS,
                table.STATUS,
                table.ORIGINAL_FILENAME,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .join(RESPONSIBILITY)
                .on(RESPONSIBILITY.ID.eq(table.RESPONSIBILITY))
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY, RESPONSIBILITY_SET)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .where(table.ID.eq(burdenEstimateSetId))
                .and(RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetch()

        return mapper.mapBurdenEstimateSets(records).singleOrNull()
                ?: throw UnknownObjectError(burdenEstimateSetId, BurdenEstimateSet::class)
    }

    override fun getBurdenEstimateSets(groupId: String, touchstoneVersionId: String, scenarioId: String): List<BurdenEstimateSet>
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
                table.ORIGINAL_FILENAME,
                BURDEN_ESTIMATE_SET_PROBLEM.PROBLEM
        )
                .from(table)
                .joinPath(table, BURDEN_ESTIMATE_SET_PROBLEM, joinType = JoinType.LEFT_OUTER_JOIN)
                .join(RESPONSIBILITY).on(RESPONSIBILITY.ID.eq(table.RESPONSIBILITY))
                .joinPath(RESPONSIBILITY, RESPONSIBILITY_SET, MODELLING_GROUP)
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .where(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                .and(MODELLING_GROUP.ID.eq(modellingGroup.id))
                .fetch()

        return mapper.mapBurdenEstimateSets(records)
    }

    override fun getBurdenEstimateOutcomesSequence(groupId: String, touchstoneVersionId: String, scenarioId: String, burdenEstimateSetId: Int)
            : Sequence<BurdenEstimateOutcome>
    {
        //check that the burden estimate set exists in the group etc
        val set = getBurdenEstimateSet(groupId, touchstoneVersionId, scenarioId, burdenEstimateSetId)

        if (set.isStochastic())
        {
            throw InvalidOperationError("Cannot get burden estimate data for stochastic burden estimate sets")
        }

        return dsl.select(
                DISEASE.ID,
                BURDEN_ESTIMATE.YEAR,
                BURDEN_ESTIMATE.AGE,
                COUNTRY.ID,
                COUNTRY.NAME,
                BURDEN_OUTCOME.CODE,
                BURDEN_ESTIMATE.VALUE
        )
                .fromJoinPath(BURDEN_ESTIMATE_SET, BURDEN_ESTIMATE)
                .join(RESPONSIBILITY)
                .on(BURDEN_ESTIMATE_SET.RESPONSIBILITY.eq(RESPONSIBILITY.ID))
                .joinPath(RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION, DISEASE)
                .join(COUNTRY)
                .on(BURDEN_ESTIMATE.COUNTRY.eq(COUNTRY.NID))
                .joinPath(BURDEN_ESTIMATE, BURDEN_OUTCOME)
                .where(BURDEN_ESTIMATE_SET.ID.eq(burdenEstimateSetId))
                .orderBy(
                        DISEASE.ID,
                        BURDEN_ESTIMATE.YEAR,
                        BURDEN_ESTIMATE.AGE,
                        COUNTRY.ID,
                        COUNTRY.NAME,
                        BURDEN_OUTCOME.CODE)
                .fetchSequence()
                .map { it.into(BurdenEstimateOutcome::class.java) }

    }

    override fun getExpectedOutcomesForBurdenEstimateSet(burdenEstimateSetId: Int): List<String>
    {
        return dsl.select(BURDEN_ESTIMATE_OUTCOME_EXPECTATION.OUTCOME)
                .from(BURDEN_ESTIMATE_SET)
                .join(RESPONSIBILITY)
                .on(BURDEN_ESTIMATE_SET.RESPONSIBILITY.eq(RESPONSIBILITY.ID))
                .joinPath(RESPONSIBILITY, BURDEN_ESTIMATE_EXPECTATION, BURDEN_ESTIMATE_OUTCOME_EXPECTATION)
                .where(BURDEN_ESTIMATE_SET.ID.eq(burdenEstimateSetId))
                .groupBy(BURDEN_ESTIMATE_OUTCOME_EXPECTATION.OUTCOME)
                .orderBy(BURDEN_ESTIMATE_OUTCOME_EXPECTATION.OUTCOME)
                .fetch()
                .getValues(BURDEN_ESTIMATE_OUTCOME_EXPECTATION.OUTCOME)
    }

    override fun addModelRunParameterSet(groupId: String, touchstoneVersionId: String,
                                         modelVersionId: Int,
                                         modelRuns: List<ModelRun>,
                                         uploader: String, timestamp: Instant): Int
    {
        // We aren't checking whether the provided disease is associated with a scenario in this
        // responsibility set but the intention is to refactor the data model so that a responsibility set
        // is tied to a single disease, which will make this easier to do down the line
        val setId = getResponsibilitySetId(groupId, touchstoneVersionId)

        return addModelRunParameterSet(setId,
                modelVersionId, modelRuns, uploader, timestamp)
    }

    private fun addModelRunParameterSet(responsibilitySetId: Int, modelVersionId: Int,
                                        modelRuns: List<ModelRun>,
                                        uploader: String, timestamp: Instant): Int
    {
        val uploadInfoId = addUploadInfo(uploader, timestamp)
        val parameterSetId = addParameterSet(responsibilitySetId, modelVersionId, uploadInfoId)
        val parameterLookup = addParameters(modelRuns, parameterSetId)

        for (run in modelRuns)
        {
            addModelRun(run, parameterSetId, parameterLookup)
        }

        return parameterSetId
    }

    override fun getModelRunParameterSet(groupId: String, touchstoneVersionId: String, setId: Int): FlexibleDataTable<ModelRun>
    {
        //First check if this set id actually belongs to this group and touchstone version
        dsl.select(MODEL_RUN_PARAMETER_SET.ID)
                .fromJoinPath(MODEL_RUN_PARAMETER_SET, RESPONSIBILITY_SET)
                .where(MODEL_RUN_PARAMETER_SET.ID.eq(setId))
                .and(RESPONSIBILITY_SET.MODELLING_GROUP.eq(groupId))
                .and(RESPONSIBILITY_SET.TOUCHSTONE.eq(touchstoneVersionId))
                .fetch()
                .singleOrNull() ?: throw UnknownObjectError(setId, "model run parameter set")

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
                .map { mapper.mapModelRun(it.key, it.value) }
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
                                uploadInfoId: Int): Int
    {
        val newParameterSet = this.dsl.newRecord(MODEL_RUN_PARAMETER_SET).apply {
            this.responsibilitySet = responsibilitySetId
            this.modelVersion = modelVersionId
            this.uploadInfo = uploadInfoId
        }

        newParameterSet.store()

        return newParameterSet.id
    }

    private fun addParameters(modelRuns: List<ModelRun>, modelRunParameterSetId: Int): Map<String, Int>
    {
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

    override fun clearBurdenEstimateSet(setId: Int, groupId: String, touchstoneVersionId: String, scenarioId: String)
    {
        // Dereference modelling group IDs
        val modellingGroup = modellingGroupRepository.getModellingGroup(groupId)

        // make sure set belongs to responsibility
        val responsibilityInfo = getResponsibilityInfo(modellingGroup.id, touchstoneVersionId, scenarioId)
        val set = getBurdenEstimateSetForResponsibility(setId, responsibilityInfo.id)

        if (set.status == BurdenEstimateSetStatus.COMPLETE)
        {
            throw InvalidOperationError("You cannot clear a burden estimate set which is marked as 'complete'.")
        }

        changeBurdenEstimateStatus(setId, BurdenEstimateSetStatus.EMPTY)
        centralEstimateWriter.clearEstimateSet(setId)
    }

    override fun changeBurdenEstimateStatus(setId: Int, newStatus: BurdenEstimateSetStatus)
    {
        dsl.update(BURDEN_ESTIMATE_SET)
                .set(BURDEN_ESTIMATE_SET.STATUS, mapper.mapEnum(newStatus))
                .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .execute()
    }

    override fun updateCurrentBurdenEstimateSet(responsibilityId: Int, setId: Int, type: BurdenEstimateSetType)
    {
        if (type.isStochastic())
        {
            throw InvalidOperationError("You cannot update a stochastic estimate set.")
        }

        dsl.update(RESPONSIBILITY)
                .set(RESPONSIBILITY.CURRENT_BURDEN_ESTIMATE_SET, setId)
                .where(RESPONSIBILITY.ID.eq(responsibilityId))
                .execute()
    }

    override fun createBurdenEstimateSet(responsibilityId: Int,
                                         modelVersionId: Int,
                                         properties: CreateBurdenEstimateSet,
                                         uploader: String,
                                         timestamp: Instant): Int
    {
        val setRecord = dsl.newRecord(BURDEN_ESTIMATE_SET).apply {
            this.modelVersion = modelVersionId
            this.responsibility = responsibilityId
            this.uploadedBy = uploader
            this.uploadedOn = Timestamp.from(timestamp)
            this.runInfo = "Not provided"
            this.interpolated = false
            this.status = "empty"
            this.setType = mapper.mapEnum(properties.type.type)
            this.setTypeDetails = properties.type.details
            this.modelRunParameterSet = properties.modelRunParameterSet
        }
        setRecord.insert()
        return setRecord.id
    }

    override fun getResponsibilityInfo(groupId: String, touchstoneVersionId: String, scenarioId: String): ResponsibilityInfo
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY.ID, SCENARIO_DESCRIPTION.DISEASE, RESPONSIBILITY_SET.STATUS, RESPONSIBILITY_SET.ID.`as`("setId"))
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY, SCENARIO, SCENARIO_DESCRIPTION)
                .joinPath(RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneVersionId))
                .and(SCENARIO_DESCRIPTION.ID.eq(scenarioId))
                .fetchOne()
                ?.into(ResponsibilityInfo::class.java)
                ?: findMissingObjects(touchstoneVersionId, scenarioId)
    }

    override fun updateBurdenEstimateSetFilename(setId: Int, filename: String?)
    {
        dsl.update(BURDEN_ESTIMATE_SET)
                .set(BURDEN_ESTIMATE_SET.ORIGINAL_FILENAME, filename)
                .where(BURDEN_ESTIMATE_SET.ID.eq(setId))
                .execute()
    }

    private fun getResponsibilitySetId(groupId: String, touchstoneVersionId: String): Int
    {
        // Get responsibility ID
        return dsl.select(RESPONSIBILITY_SET.ID)
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, TOUCHSTONE)
                .where(MODELLING_GROUP.ID.eq(groupId))
                .and(TOUCHSTONE.ID.eq(touchstoneVersionId))
                .fetchOneInto(Int::class.java)
                ?: throw UnknownObjectError(touchstoneVersionId, TouchstoneVersion::class)
    }

    private fun <T> findMissingObjects(touchstoneVersionId: String, scenarioId: String): T
    {
        touchstoneRepository.touchstoneVersions.get(touchstoneVersionId)
        scenarioRepository.checkScenarioDescriptionExists(scenarioId)
        // Note this is where the scenario_description *does* exist, but
        // the group is not responsible for it in this touchstoneVersion
        throw UnknownObjectError(scenarioId, "responsibility")
    }
}