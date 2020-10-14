package org.vaccineimpact.api.models

data class CoverageIngestionRow(
        val vaccine: String,
        val country: String,
        val activityType: ActivityType,
        val gaviSupport: GAVISupportLevel,
        val year: Int,
        val ageFirst: Int,
        val ageLast: Int,
        val gender: GenderEnum,
        val target: Float,
        val coverage: Float
)
