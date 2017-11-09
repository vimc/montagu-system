package org.vaccineimpact.api.models

import java.beans.ConstructorProperties
import java.time.Instant

data class BurdenEstimateSet
@ConstructorProperties("id", "uploadedOn", "uploadedBy", "problems")
constructor(
        override val id: Int,
        val uploadedOn: Instant,
        val uploadedBy: String,
        val problems: List<String>
) : HasKey<Int>
