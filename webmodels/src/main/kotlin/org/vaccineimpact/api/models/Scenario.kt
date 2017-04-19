package org.vaccineimpact.api.models

data class Scenario(override val id: String,
                    val description: String,
                    val disease: String,
                    val touchstones: List<String>) : HasKey<String>