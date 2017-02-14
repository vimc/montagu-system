package uk.ac.imperial.vimc.demo.app.models


data class CountryOutcomes(val country: String, val data: List<Outcome>)

class Outcome(val year: Year, values: Map<String, Double?>) {
    val numberOfDeaths = values["Deaths"]
    val cases          = values["Cases"]
    val dalys          = values["DALYs"]
    val fvps           = values["FVPs"]
    val deathsAverted  = values["Deaths Averted"]
}