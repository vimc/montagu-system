package uk.ac.imperial.vimc.demo.app.repositories.fake

import uk.ac.imperial.vimc.demo.app.errors.UnknownObject
import uk.ac.imperial.vimc.demo.app.filters.ScenarioFilterParameters
import uk.ac.imperial.vimc.demo.app.models.ModellingGroup
import uk.ac.imperial.vimc.demo.app.models.Year
import uk.ac.imperial.vimc.demo.app.repositories.ModellingGroupRepository
import uk.ac.imperial.vimc.demo.app.repositories.ScenarioRepository
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDataAndGroup
import uk.ac.imperial.vimc.demo.app.models.ImpactEstimateDescription
import uk.ac.imperial.vimc.demo.app.models.ModellingGroupEstimateListing
import uk.ac.imperial.vimc.demo.app.models.NewImpactEstimate
import java.time.LocalDate
import java.time.Month
import java.time.ZoneOffset

class FakeModellingGroupRepository(private val scenarioRepository: ScenarioRepository): ModellingGroupRepository {
    private val generator = FakeDataGenerator()
    private val menAScenario = scenarioRepository.scenarios.get("menA-novacc")
    private val yfScenario = scenarioRepository.scenarios.get("yf-routine-gavi")

    override val modellingGroups = InMemoryDataSet.new(listOf(
            ModellingGroup("pennsylvania-state", "Pennsylvania State University"),
            ModellingGroup("harvard-public-health", "Harvard University School of Public Health"),
            ModellingGroup("oxford-vietnam", "Oxford University Clinical Research Unit (Vietnam)"),
            ModellingGroup("john-hopkins", "Johns Hopkins University"),
            ModellingGroup("cda", "CDA (Center for Disease Analysis)"),
            ModellingGroup("cambridge", "University of Cambridge"),
            ModellingGroup("london-school", "London School of Hygiene & Tropical Medicine"),
            ModellingGroup("phe", "Public Health England"),
            ModellingGroup("imperial", "Imperial College London")
    ))

    override fun getModellingGroupEstimateListing(groupId: String, filterParameters: ScenarioFilterParameters): ModellingGroupEstimateListing {
        val group = modellingGroups.get(groupId)
        val estimates = fakeEstimateDescriptions(group.id)
        val filter = InMemoryModellingGroupFilter(filterParameters)
        return ModellingGroupEstimateListing(group, filter.modelMatchesParameter(estimates).toList())
    }

    override fun getEstimateForGroup(groupId: String, estimateId: Int): ImpactEstimateDataAndGroup {
        val group = modellingGroups.get(groupId)
        val estimateDescription = fakeEstimateDescriptions(group.id).singleOrNull { it.id == estimateId }
            ?: throw UnknownObject(estimateId, "ImpactEstimate")
        val outcomes = generator.generateOutcomes(estimateDescription.scenario.id, scenarioRepository)
        return ImpactEstimateDataAndGroup(group, estimateDescription, outcomes)
    }

    override fun createEstimate(groupId: String, data: NewImpactEstimate): ImpactEstimateDataAndGroup {
        val group = modellingGroups.get(groupId)
        val scenario = data.getScenario(scenarioRepository)
        val estimates = data.getImpactEstimates(scenario)
        estimates.id = 6    //First unused ID
        val description = ImpactEstimateDescription(estimates.id, scenario, estimates.modelVersion, estimates.uploadedTimestamp)
        return ImpactEstimateDataAndGroup(group, description, estimates.outcomes)
    }

    private fun fakeEstimateDescriptions(groupId: String) = when (groupId) {
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