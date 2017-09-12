package org.vaccineimpact.api.models

import java.time.Instant

class BurdenEstimate(override val id: Int, val uploadedOn: Instant, val problems: List<String>) : HasKey<Int>