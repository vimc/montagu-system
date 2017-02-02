package uk.ac.imperial.vimc.demo.app.models

@Suppress("Unused")
class CountryOutcomes(val country: Country, val data: List<Outcome>)

data class Outcome(val year: Year, val numberOfDeaths: Int)