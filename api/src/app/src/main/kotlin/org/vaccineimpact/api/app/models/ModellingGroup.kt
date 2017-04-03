package org.vaccineimpact.api.app.models

data class ModellingGroup(override val id: String,
                          val description: String) : HasKey<String>