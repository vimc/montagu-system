package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class ModelVersion
@ConstructorProperties("id", "model", "version", "note", "fingerprint", "isDynamic", "code", "maxCountries")
constructor(override val id: String,
            val model: String,
            val version: String,
            val note: String?,
            val fingerprint: String?,
            val isDynamic: Boolean?,
            val code: String?,
            val maxCountries: Int?): HasKey<String>