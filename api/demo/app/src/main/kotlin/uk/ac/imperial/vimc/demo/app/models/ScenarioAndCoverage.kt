package uk.ac.imperial.vimc.demo.app.models

data class ScenarioAndCoverage(val scenario: Scenario,
                               val countries: List<String>,
                               val years: IntRange,
                               val coverage: List<CountryCoverage>)