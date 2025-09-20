package org.vaccineimpact.api.models.responsibilities

import java.beans.ConstructorProperties
import java.time.Instant

data class ResponsibilityComment
@ConstructorProperties("comment", "addedBy", "addedOn")
constructor(
        val comment: String,
        val addedBy: String,
        val addedOn: Instant
)

data class ResponsibilityCommentPayload
constructor(
        val comment: String
)
