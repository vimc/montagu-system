package org.vaccineimpact.api.models

import org.vaccineimpact.api.models.helpers.Rule
import org.vaccineimpact.api.models.helpers.SerializationRule
import java.beans.ConstructorProperties

data class ResearchModel
@ConstructorProperties("id", "description", "citation", "modellingGroup", "genderSpecific", "gender")
constructor(override val id: String,
            val description: String,
            val citation: String,
            val modellingGroup: String,
            @SerializationRule(Rule.EXCLUDE_IF_NULL)
            val genderSpecific: Boolean? = null,
            @SerializationRule(Rule.EXCLUDE_IF_NULL)
            val gender: String? = null,
            @SerializationRule(Rule.EXCLUDE_IF_NULL)
            var currentVersion: ModelVersion? = null) : HasKey<String>