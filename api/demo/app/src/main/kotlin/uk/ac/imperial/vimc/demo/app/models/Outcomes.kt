package uk.ac.imperial.vimc.demo.app.models

data class CountryOutcomes(val country: String, val data: List<Outcome>)

data class Outcome(val year: Year, val numberOfDeaths: Int)