package uk.ac.imperial.vimc.demo.app.repositories.jooq

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.extensions.fetchInto
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.filters.whereMatchesFilter
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.models.jooq.Tables.*
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.CoverageScenarioDescriptionRecord
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.ModelRecord
import uk.ac.imperial.vimc.demo.app.models.jooq.tables.records.ModellingGroupRecord
import uk.ac.imperial.vimc.demo.app.repositories.DataSet
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository

class JooqModellingGroupRepository : JooqRepository(), ModellingGroupRepository {
    override val modellingGroups: DataSet<ModellingGroup, Int>
        get() = JooqDataSet.new(dsl, MODELLING_GROUP, { it.ID }, this::mapModellingGroup)

    private fun groupHasCode(groupCode: String) = MODELLING_GROUP.CODE.eq(groupCode)

    override fun getModellingGroupByCode(groupCode: String): ModellingGroup {
        val record = dsl.fetchAny(MODELLING_GROUP, groupHasCode(groupCode))
                ?: throw UnknownObject(groupCode, ModellingGroup::class.simpleName!!)
        return mapModellingGroup(record)
    }

    override fun getModels(groupCode: String): List<VaccineModel> {
        return dsl.select()
                .from(MODEL)
                .join(MODELLING_GROUP).onKey()
                .where(groupHasCode(groupCode))
                .fetchInto<ModelRecord>()
                .map { VaccineModel(it.id, it.name, it.citation, it.description) }
    }

    override fun getResponsibilities(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): Responsibilities {
        val group = getModellingGroupByCode(groupCode)
        val responsibility_set = dsl.fetchAny(RESPONSIBILITY_SET,
                RESPONSIBILITY_SET.MODELLING_GROUP.eq(group.id))
        val scenarios = dsl
                .select(COVERAGE_SCENARIO_DESCRIPTION.fields().toList())
                .fromJoinPath(RESPONSIBILITY, COVERAGE_SCENARIO, COVERAGE_SCENARIO_DESCRIPTION)
                .where(RESPONSIBILITY.RESPONSIBILITY_SET.eq(responsibility_set.id))
                .whereMatchesFilter(JooqScenarioFilter(), scenarioFilterParameters)
                .fetchInto<CoverageScenarioDescriptionRecord>()
                .map { JooqScenarioRepository.scenarioMapper(it) }
                .map(::Responsibility)
        return Responsibilities(group, scenarios, responsibility_set.complete)
    }

    override fun getEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        val group = getModellingGroupByCode(groupCode)
        val scenarioIdField = COVERAGE_SCENARIO_DESCRIPTION.ID
        val impactEstimates = dsl
                .select(
                        IMPACT_ESTIMATE_SET.ID,
                        IMPACT_ESTIMATE_SET.UPLOADED_TIMESTAMP,
                        MODEL_VERSION.VERSION,
                        MODEL.NAME,
                        scenarioIdField
                )
                .fromJoinPath(MODELLING_GROUP, RESPONSIBILITY_SET, RESPONSIBILITY)
                .joinPath(RESPONSIBILITY, IMPACT_ESTIMATE_SET, MODEL_VERSION, MODEL)
                .joinPath(RESPONSIBILITY, COVERAGE_SCENARIO, COVERAGE_SCENARIO_DESCRIPTION)
                .where(groupHasCode(groupCode))
                .toList()
        val scenarioIds : List<String> = impactEstimates.map { it[scenarioIdField] }.toList()
        val scenarios = dsl
                .fetch(COVERAGE_SCENARIO_DESCRIPTION, scenarioIdField.`in`(scenarioIds))
                .map { JooqScenarioRepository.scenarioMapper(it) }

        val listing = impactEstimates.map {
            record ->
            ImpactEstimateDescription(
                    record[IMPACT_ESTIMATE_SET.ID],
                    scenarios.single { record[scenarioIdField] == it.id },
                    ModelIdentifier(record[MODEL.NAME], record[MODEL_VERSION.VERSION]),
                    record[IMPACT_ESTIMATE_SET.UPLOADED_TIMESTAMP].toInstant()
            )
        }
        return ModellingGroupEstimateListing(group, listing)
    }

    override fun getEstimate(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    private fun mapModellingGroup(x: ModellingGroupRecord) = ModellingGroup(x.id, x.code, x.description)
}