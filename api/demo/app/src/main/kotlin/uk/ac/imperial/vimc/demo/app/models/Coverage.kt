package uk.ac.imperial.vimc.demo.app.models

import java.math.BigDecimal

data class CountryCoverage(val country: String, val data: List<YearCoverage>)

// coverage is nullable, because we want to represent the possibility of missing data for a given country and year
data class YearCoverage(val year: Year, val coverage: BigDecimal?)