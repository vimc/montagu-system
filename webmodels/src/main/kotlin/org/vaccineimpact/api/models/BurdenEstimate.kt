package org.vaccineimpact.api.models

import java.math.BigDecimal

data class BurdenEstimate(
        val disease: String,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: Int,
        val outcomes: Map<String, BigDecimal>
)

class BurdenEstimateSet(val estimates: List<BurdenEstimate>)