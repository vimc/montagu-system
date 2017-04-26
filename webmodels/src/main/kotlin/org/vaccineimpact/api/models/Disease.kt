package org.vaccineimpact.api.models

data class Disease(override val id: String, val name: String): HasKey<String>