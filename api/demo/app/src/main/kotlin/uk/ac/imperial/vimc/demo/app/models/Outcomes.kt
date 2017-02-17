package uk.ac.imperial.vimc.demo.app.models


data class CountryOutcomes(val country: String, val data: List<Outcome>)
{
    fun toLines(): Iterable<OutcomeLine> = data.flatMap { it.toLines(country) }
}

class Outcome(val year: Year, private val values: Map<String, Double?>)
{
    val deaths get() = values[Keys.deaths]
    val cases get() = values[Keys.cases]
    val dalys get() = values[Keys.dalys]
    val fvps get() = values[Keys.fvps]
    val deathsAverted get() = values[Keys.deathsAverted]

    fun toLines(country: String): Iterable<OutcomeLine> = values.map {
        OutcomeLine(country, year, it.key, it.value)
    }

    companion object Keys {
        val deaths = "deaths"
        val cases = "cases"
        val dalys = "dalys"
        val fvps = "fvps"
        val deathsAverted = "deaths_averted"
        val all = listOf(deaths, cases, dalys, fvps, deathsAverted)

        fun fromDatabaseCode(code: String): String = when(code)
        {
            "Deaths" -> deaths
            "Cases" -> cases
            "DALYs" -> dalys
            "FVPs" -> fvps
            "Deaths Averted" -> deathsAverted
            else -> "unknown"
        }
    }
}

data class OutcomeLine(val country: String, val year: Year, val code: String, val value: Double?)