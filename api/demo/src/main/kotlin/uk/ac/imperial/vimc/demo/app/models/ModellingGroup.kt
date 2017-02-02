package uk.ac.imperial.vimc.demo.app.models

import java.time.LocalDate
import java.time.Month

data class ModellingGroup(val id: String, val description: String, val estimates: List<ImpactEstimate>)

object StaticModellingGroups {
    private val menAScenario = StaticScenarios.all.filter { it.vaccine == "MenA" }.first()
    private val yfScenario = StaticScenarios.all.filter { it.vaccine == "YF" }.first()

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
                    ImpactEstimate(1, menAScenario, "SuperModel 1.0", LocalDate.of(2017, Month.JANUARY, 15), StaticCountries.all, StaticData.defaultYears),
                    ImpactEstimate(2, menAScenario, "SuperModel 1.1", LocalDate.of(2017, Month.JANUARY, 20), StaticCountries.all, StaticData.defaultYears),
                    ImpactEstimate(3, menAScenario, "SuperModel 1.1", LocalDate.of(2017, Month.JANUARY, 21), StaticCountries.all, StaticData.defaultYears),
                    ImpactEstimate(4, yfScenario, "YF Model 3.14", LocalDate.of(2017, Month.JANUARY, 2), StaticCountries.all, StaticData.defaultYears),
                    ImpactEstimate(5, yfScenario, "YF Model 3.14", LocalDate.of(2017, Month.JANUARY, 3), StaticCountries.all, StaticData.defaultYears)
            ))
    )
}