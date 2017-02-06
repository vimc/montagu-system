package uk.ac.imperial.vimc.demo.app.models

import java.time.LocalDate
import java.time.Month
import java.time.ZoneOffset

class ModellingGroup(val id: String, val description: String, estimates: Iterable<ImpactEstimate>) {
    val estimates = estimates.toMutableList()
}

object StaticModellingGroups {
    private val menAScenario = StaticScenarios.all.filter { it.vaccine == "MenA" }.first()
    private val yfScenario = StaticScenarios.all.filter { it.vaccine == "YF" }.first()
    private val generator = FakeDataGenerator()

    fun newEstimateId(): Int {
        val highestId = all.map {
            g -> g.estimates.map { e -> e.id }.max() ?: 0
        }.max() ?: 0
        return highestId + 1
    }

    val all = listOf(
            ModellingGroup("pennsylvania-state", "Pennsylvania State University", emptyList()),
            ModellingGroup("harvard-public-health", "Harvard University School of Public Health", emptyList()),
            ModellingGroup("oxford-vietnam", "Oxford University Clinical Research Unit (Vietnam)", emptyList()),
            ModellingGroup("john-hopkins", "Johns Hopkins University", emptyList()),
            ModellingGroup("cda", "CDA (Center for Disease Analysis)", emptyList()),
            ModellingGroup("cambridge", "University of Cambridge", emptyList()),
            ModellingGroup("london-school", "London School of Hygiene & Tropical Medicine", emptyList()),
            ModellingGroup("phe", "Public Health England", emptyList()),
            ModellingGroup("imperial", "Imperial College London", listOf(
                    ImpactEstimate(1, menAScenario, "SuperModel 1.0",
                            date(2017, Month.JANUARY, 15),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(2, menAScenario, "SuperModel 1.1",
                            date(2017, Month.JANUARY, 20),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(3, menAScenario, "SuperModel 1.1",
                            date(2017, Month.JANUARY, 21),
                            generator.generateOutcomes(menAScenario)),
                    ImpactEstimate(4, yfScenario, "YF Model 3.14",
                            date(2017, Month.JANUARY, 2),
                            generator.generateOutcomes(yfScenario)),
                    ImpactEstimate(5, yfScenario, "YF Model 3.14",
                            date(2017, Month.JANUARY, 3),
                            generator.generateOutcomes(yfScenario))
            ))
    )

    private fun date(year: Year, month: Month, day: Int) = LocalDate.of(year, month, day)
            .atStartOfDay()
            .plus(generator.randomTimeOffset())
            .toInstant(ZoneOffset.UTC)
}