package org.vaccineimpact.api.models

import java.beans.ConstructorProperties

data class Model
@ConstructorProperties("id", "description", "citation", "modellingGroup")
constructor(override val id: String,
                 val description: String,
                 val citation: String,
                 val modellingGroup: String): HasKey<String>