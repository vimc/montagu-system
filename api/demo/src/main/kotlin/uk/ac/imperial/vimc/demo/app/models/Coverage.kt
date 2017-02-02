package uk.ac.imperial.vimc.demo.app.models

import java.math.BigDecimal

class CountryCoverage(country: Country, data: Iterable<YearCoverage>) {
    @Suppress("unused")
    val country = country.toString()
    @Suppress("unused")
    val data = data.toList()
}

data class YearCoverage(val year: Year, val coverage: BigDecimal)