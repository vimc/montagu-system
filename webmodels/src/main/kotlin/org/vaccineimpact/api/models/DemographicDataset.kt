package org.vaccineimpact.api.models

import java.math.BigDecimal

data class DemographicDataset(
        override val id: String,
        val name: String,
        val genderIsApplicable: Boolean,
        val source: String? = null,
        val countries: List<String>? = null,
        val sources: List<String>? = null) : HasKey<String>

data class DemographicData(
        override val id: String,
        val name: String,
        val gender: String?,
        val countries: List<String>,
        val unit: String,
        val ageInterpretation: String,
        val source: String?) : HasKey<String>

data class DemographicDataForTouchstone(
        val touchstone: Touchstone,
        val demographicData: DemographicData
)

data class DemographicRow(
        val countryCodeNumeric: Int,
        val countryCode: String,
        val country: String,
        val ageFrom: Int,
        val ageTo: Int,
        val year: Int,
        val gender: String,
        val value: BigDecimal
)