package org.vaccineimpact.api.models

data class DemographicStatisticType(
        override val id: String,
        val name: String,
        val genderIsApplicable: Boolean,
        val countries: List<String>,
        val sources: List<String>) : HasKey<String>