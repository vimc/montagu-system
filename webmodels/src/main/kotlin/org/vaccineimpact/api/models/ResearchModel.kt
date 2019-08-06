package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class ResearchModel
@ConstructorProperties("id", "description", "citation", "modellingGroup")
constructor(override val id: String,
            val description: String,
            val citation: String,
            val modellingGroup: String) : HasKey<String>

data class ResearchModelDetails
@ConstructorProperties("id", "description", "citation", "modellingGroup", "disease", "genderSpecific", "gender")
constructor(override val id: String,
            val description: String,
            val citation: String,
            val modellingGroup: String,
            var disease: Disease,
            val genderSpecific: Boolean? = null,
            val gender: String? = null,
            var currentVersion: ModelVersion? = null) : HasKey<String>