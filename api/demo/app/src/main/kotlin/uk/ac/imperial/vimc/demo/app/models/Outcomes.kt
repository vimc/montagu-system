package uk.ac.imperial.vimc.demo.app.models


data class CountryOutcomes(val country: String, val data: List<Outcome>) {
    fun toLines() : Iterable<OutcomeLine> = data.flatMap { it.toLines(country) }
}

class Outcome(val year: Year, private val values: Map<String, Double?>) {
    val numberOfDeaths get() = values["Deaths"]
    val cases          get() = values["Cases"]
    val dalys          get() = values["DALYs"]
    val fvps           get() = values["FVPs"]
    val deathsAverted  get() = values["Deaths Averted"]

    fun toLines(country: String): Iterable<OutcomeLine> = values.map {
        OutcomeLine(country, year, it.key, it.value)
    }
}

data class OutcomeLine(val country: String, val year: Year, val code: String, val value: Double?)