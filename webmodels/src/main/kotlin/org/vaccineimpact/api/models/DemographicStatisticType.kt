package org.vaccineimpact.api.models

import java.math.BigDecimal

data class DemographicStatisticType(
        override val id: String,
        val name: String,
        val genderIsApplicable: Boolean,
        val countries: List<String>,
        val sources: List<String>) : HasKey<String>

data class DemographicDataset(
        override val id: String,
        val name: String,
        val variant: String,
        val gender: String,
        val countries: List<String>,
        val unit: String,
        val ageInterpretation: String,
        val source: String) : HasKey<String>

data class DemographicDataForTouchstone(
        val touchstone: Touchstone,
        val demographicData: DemographicStatisticType?
)

data class DemographicRow(
        val country: String,
        val age: String,
        val year: Int,
        val gender: String,
        val value: BigDecimal
)