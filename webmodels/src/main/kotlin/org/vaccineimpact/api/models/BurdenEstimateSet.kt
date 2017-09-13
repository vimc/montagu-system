package org.vaccineimpact.api.models

import java.time.Instant

class BurdenEstimateSet(override val id: Int,
                        val uploadedOn: Instant,
                        val problems: List<String>) : HasKey<Int>