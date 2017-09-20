package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.FlexibleColumns
import java.math.BigDecimal

@FlexibleColumns
data class BurdenEstimate(
        val disease: String,
        val year: Int,
        val age: Int,
        val country: String,
        val countryName: String,
        val cohortSize: Int,
        val outcomes: Map<String, BigDecimal?>
)