package uk.ac.imperial.vimc.demo.app.models

import java.math.BigDecimal

data class CountryCoverage(val country: String, val data: List<YearCoverage>)

data class YearCoverage(val year: Year, val coverage: BigDecimal)