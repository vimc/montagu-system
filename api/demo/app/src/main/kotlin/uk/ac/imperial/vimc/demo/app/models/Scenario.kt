package uk.ac.imperial.vimc.demo.app.models

import uk.ac.imperial.vimc.demo.app.repositories.FakeDataGenerator

@Suppress("Unused", "CanBeParameter")
class Scenario(val id: String,
               val description: String,
               val vaccinationLevel: String,
               val disease: String,
               val vaccine: String,
               val scenarioType: String,
               countries: Iterable<Country>,
               val years: IntRange,
               coverage: Iterable<CountryCoverage>? = null): HasKey<String> {

    override val key: String = id

    val countries = countries.toSet()
    val coverage = (coverage ?: FakeDataGenerator().generateCoverage(id, this.countries, years)).toList()
}