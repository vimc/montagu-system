package org.vaccineimpact.api.models

data class ModellingGroup(override val id: String,
                          val description: String) : HasKey<String>