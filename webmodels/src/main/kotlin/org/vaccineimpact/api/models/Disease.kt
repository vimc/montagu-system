package org.vaccineimpact.api.models

import java.beans.ConstructorProperties


data class Disease
@ConstructorProperties("id", "name")
constructor(override val id: String, val name: String): HasKey<String>