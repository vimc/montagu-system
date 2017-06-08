package org.vaccineimpact.api.models

data class ResearchModel(override val id: String,
                         val description: String,
                         val citation: String,
                         val modellingGroup: String): HasKey<String>