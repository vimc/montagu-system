package org.vaccineimpact.api.security

import org.vaccineimpact.api.db.getResource

fun getReviewersMap(): Map<String, List<String>> = getResource("model-review-2019")
        .readText()
        .split("\n")
        .filter { it.length > 1 }
        .map {
            val row = it.split(",").filter { it.length > 1 }
            row[0] to row.subList(1, row.count())
        }.toMap()
