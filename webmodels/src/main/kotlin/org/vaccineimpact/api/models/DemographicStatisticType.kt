package org.vaccineimpact.api.models

data class DemographicStatisticType(
        override val id: String,
        val name: String,
        val variants: List<String>,
        val genderIsApplicable: Boolean,
        val countries: List<String>,
        val source: String) : HasKey<String>