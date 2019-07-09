package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Model
@ConstructorProperties("id", "description", "citation", "modellingGroup", "genderSpecific", "gender")
constructor(override val id: String,
                 val description: String,
                 val citation: String,
                 val modellingGroup: String,
                 val genderSpecific: Boolean?,
                 val gender: String?,
                 var currentVersion: ModelVersion?): HasKey<String>