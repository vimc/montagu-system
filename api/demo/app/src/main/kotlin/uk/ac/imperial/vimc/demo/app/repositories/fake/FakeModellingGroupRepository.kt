package uk.ac.imperial.vimc.demo.app.repositories.fake

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.*
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository
import java.time.LocalDate
import java.time.Month
import java.time.ZoneOffset

class FakeModellingGroupRepository(private val scenarioRepository: ScenarioRepository): ModellingGroupRepository {
    private val generator = FakeDataGenerator()
    private val menAScenario = scenarioRepository.scenarios.get("menA-novacc")
    private val yfScenario = scenarioRepository.scenarios.get("yf-routine-gavi")

    override val modellingGroups = InMemoryDataSet.new(listOf(
            ModellingGroup(1, "pennsylvania-state", "Pennsylvania State University"),
            ModellingGroup(2, "harvard-public-health", "Harvard University School of Public Health"),
            ModellingGroup(3, "oxford-vietnam", "Oxford University Clinical Research Unit (Vietnam)"),
            ModellingGroup(4, "john-hopkins", "Johns Hopkins University"),
            ModellingGroup(5, "cda", "CDA (Center for Disease Analysis)"),
            ModellingGroup(6, "cambridge", "University of Cambridge"),
            ModellingGroup(7, "london-school", "London School of Hygiene & Tropical Medicine"),
            ModellingGroup(8, "phe", "Public Health England"),
            ModellingGroup(9, "imperial", "Imperial College London")
    ))

    override fun getModellingGroupByCode(groupCode: String): ModellingGroup {
        return modellingGroups.all().singleOrNull { it.code == groupCode }
            ?: throw UnknownObject(groupCode, ModellingGroup::class.simpleName!!)
    }

    override fun getModels(groupCode: String): List<VaccineModel> {
        return listOf(VaccineModel(1, "FakeModel", "Fake citation", "A description"))
    }

    override fun getResponsibilities(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): Responsibilities {
        val group = getModellingGroupByCode(groupCode)
        val filter = InMemoryScenarioFilter(scenarioFilterParameters)
        val scenarios = filter.apply(scenarioRepository.scenarios.all())
        val responsibilities = scenarios.map(::Responsibility)
        return Responsibilities(group, responsibilities, complete = false)
    }

    override fun getEstimateListing(groupCode: String, scenarioFilterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        val group = getModellingGroupByCode(groupCode)
        val estimates = fakeEstimateDescriptions(group.code)
        val filter = InMemoryModellingGroupFilter(scenarioFilterParameters)
        return ModellingGroupEstimateListing(group, filter.apply(estimates).toList())
    }

    override fun getEstimate(groupCode: String, estimateId: Int): ImpactEstimateDataAndGroup {
        val group = getModellingGroupByCode(groupCode)
        val estimateDescription = fakeEstimateDescriptions(group.code).singleOrNull { it.id == estimateId }
            ?: throw UnknownObject(estimateId, "ImpactEstimate")
        val outcomes = generator.generateOutcomes(estimateDescription.scenario.id, scenarioRepository)
        return ImpactEstimateDataAndGroup(group, estimateDescription, outcomes)
    }

    override fun createEstimate(groupCode: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        val group = getModellingGroupByCode(groupCode)
        val scenario = data.getScenario(scenarioRepository)
        val estimates = data.getImpactEstimates(scenario)
        estimates.id = 6    //First unused ID
        val description = ImpactEstimateDescription(estimates.id, scenario, estimates.modelVersion, estimates.uploadedTimestamp)
        return ImpactEstimateDataAndGroup(group, description, estimates.outcomes)
    }

    private fun fakeEstimateDescriptions(groupCode: String) = when (groupCode) {
        "imperial" -> listOf(
                ImpactEstimateDescription(1, menAScenario, "SuperModel 1.0", date(2017, Month.JANUARY, 15)),
                ImpactEstimateDescription(2, menAScenario, "SuperModel 1.1", date(2017, Month.JANUARY, 20)),
                ImpactEstimateDescription(3, menAScenario, "SuperModel 1.1", date(2017, Month.JANUARY, 21)),
                ImpactEstimateDescription(4, yfScenario, "YF Model 3.14", date(2017, Month.JANUARY, 2)),
                ImpactEstimateDescription(5, yfScenario, "YF Model 3.14", date(2017, Month.JANUARY, 3))
        )
        else -> emptyList()
    }

    private fun date(year: Year, month: Month, day: Int) = LocalDate.of(year, month, day)
            .atStartOfDay()
            .plus(generator.randomTimeOffset())
            .toInstant(ZoneOffset.UTC)
}